import {
  Department,
  DepartmentAvailableSetting,
  Employee,
  Ticket,
  TicketAssignUpdate,
  TicketCommentUpdate,
  TicketTag,
  TicketTagUpdate,
} from "@models";
import { DepartmentDocument, EmployeeDocument, EmployeeModel } from "@@types/models";
import { APIFeatures, AppError, catchAsync } from "@utils";
import { ticketEvent } from "@events";

export const getAllTickets = catchAsync(async (req, res) => {
  const query = Ticket.find({
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo closedBy",
    select: "name email fullName",
  });
  const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
  const tickets = await features.query;
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tickets.length,
    data: {
      tickets,
    },
  });
});

export const getTicket = catchAsync(async (req, res, next) => {
  if (isNaN(+req.params.id)) return next(new AppError("Ticket id must be a number", 400));
  const ticket = await Ticket.findOne({
    ticketId: +req.params.id,
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo updates closedBy",
    select: "name email image slug fullName comment assign op date createdBy",
    populate: { path: "assign createdBy", select: "fullName email image slug" },
  });

  if (!ticket) return next(new AppError("No ticket found with this id", 404));

  res.sendJson(200, { ticket });
});

export const createTicket = catchAsync(async (req, res, next) => {
  const dept = await Department.findById(req.body.department).populate("members");
  if (!dept) return next(new AppError("There is no department with the given department id", 404));
  // @ts-ignore
  const allowsTickets: DepartmentDocument[] = await DepartmentAvailableSetting.allowTickets();
  if (!allowsTickets.find((d) => d._id.toString() === req.body.department)) {
    return next(new AppError("This department does not accept tickets", 400));
  }
  const assignedTo = dept.members!.filter((m) => m.role === "LEADER").map((m) => m._id);
  const { title, description, department, priority } = req.body;

  const response = await Ticket.create({
    title,
    description,
    department,
    priority,
    assignedTo,
    submittedBy: req.employee._id,
    status: "OPEN",
    createdAt: new Date(req.requestTime),
    updatedAt: new Date(req.requestTime),
  });

  const ticket = await Ticket.populate(response, {
    path: "department submittedBy assignedTo",
    select: "name email fullName",
  });
  res.sendJson(201, { ticket });
  ticketEvent.submit(ticket);
});

export const addTicketUpdate = catchAsync(async (req, res, next) => {
  if (isNaN(+req.params.id)) return next(new AppError("Ticket id must be a number", 400));
  const ticket = await Ticket.findOne({
    ticketId: Number(req.params.id),
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo updates closedBy",
    select: "name email image slug fullName comment assign op date createdBy closedBy",
    populate: { path: "assign createdBy", select: "fullName email image slug" },
  });
  if (!ticket) return next(new AppError("No ticket found with this id", 404));
  if (ticket.status === "CLOSED") return next(new AppError("This ticket is closed", 403));
  const data = {
    date: req.requestTime,
    createdBy: req.employee._id,
    ticket: ticket._id,
  };
  let newTicket;
  const isOnlySubmittedUser =
    // Is submitted user and not an assigned user
    ticket.submittedBy._id.toString() === req.employee._id.toString() &&
    !(ticket.assignedTo as EmployeeDocument[]).some(
      (employee) => employee._id.toString() === req.employee._id.toString()
    );

  switch (req.body.type) {
    case "COMMENT":
      const ticketCommentUpdate = await TicketCommentUpdate.create({
        ...data,
        comment: req.body.comment,
      });
      const comment = ticketCommentUpdate.toJSON();
      comment.createdBy = {
        _id: req.employee._id,
        fullName: req.employee.fullName,
        image: req.employee.image,
        slug: req.employee.slug,
        email: req.employee.email,
        id: req.employee._id,
      };
      ticket.updates ? ticket.updates.push(comment) : (ticket.updates = [comment]);
      newTicket = ticket;
      ticketEvent.comment(ticketCommentUpdate);
      break;
    case "ASSIGN":
      if (isOnlySubmittedUser)
        return next(new AppError("You are not authorized to assign a user to this ticket", 403));
      // Make sure valid employee
      const emp = await Employee.findOne({ _id: req.body.assign, active: true });
      if (!emp)
        return next(
          new AppError("There is no active user with the id you are trying to assign", 400)
        );
      if (!["ADD", "REMOVE"].includes(req.body.op))
        return next(new AppError("`op` property must be have the value `ADD` or `REMOVE`", 400));
      const assignedIds = (ticket.assignedTo as Pick<EmployeeModel, "_id">[]).map((e) =>
        e._id.toString()
      );
      // If operation is add
      if (req.body.op === "ADD") {
        // If employee is not in the assignedTo list
        if (assignedIds.includes(req.body.assign))
          return next(
            new AppError(
              "The user you are trying to assign is already assigned to this ticket",
              400
            )
          );
        // Create ticket update
        const update = await TicketAssignUpdate.create({
          ...data,
          assign: req.body.assign,
          op: req.body.op,
        });
        newTicket = await Ticket.findByIdAndUpdate(
          ticket._id,
          { $push: { assignedTo: emp._id } },
          { new: true }
        ).populate({
          path: "department submittedBy assignedTo updates",
          select: "name email image slug fullName comment assign op date createdBy",
          populate: { path: "assign createdBy", select: "fullName email image slug" },
        });
        ticketEvent.assign(update);
        break;
      }
      // If operation is remove
      if (!assignedIds.includes(req.body.assign)) {
        return next(new AppError("The user is not assigned to this ticket", 400));
      }
      const newAssigned = (ticket.assignedTo as EmployeeModel[]).filter(
        (e) => e._id.toString() !== emp._id.toString()
      );
      ticket.assignedTo = newAssigned;
      const req1 = ticket.save();
      const req2 = TicketAssignUpdate.create({ ...data, assign: req.body.assign, op: req.body.op });
      [newTicket] = await Promise.all([req1, req2]);
      break;
    case "TAG":
      if (isOnlySubmittedUser)
        return next(new AppError("You are not authorized to add a tag to this ticket", 403));
      // Make sure label is valid
      const tag = await TicketTag.findOne({ name: req.body.tag });
      if (!tag) return next(new AppError("There is no label with the name ${}", 400));
      // Make sure operation is either add or remove

      // If operation is add

      // If operation is remove

      await TicketTagUpdate.create({ ...data, tag: req.body.tag });
      break;
    default:
      return next(
        new AppError(
          'The property `type` must be one of the following values: "COMMENT", "ASSIGN", "TAG"',
          400
        )
      );
  }
  ticket.updatedAt = new Date();
  await ticket.save();
  res.sendJson(200, { ticket: newTicket });
});

export const closeTicket = catchAsync(async (req, res, next) => {
  if (isNaN(+req.params.id)) return next(new AppError("Ticket id must be a number", 400));
  const ticket = await Ticket.findOne({
    ticketId: +req.params.id,
    // Either was created by requesting user or assigned to requesting user
    $or: [{ submittedBy: req.employee._id }, { assignedTo: { $in: req.employee._id } }],
    // @ts-ignore
  }).populate({
    path: "department submittedBy assignedTo updates",
    select: "name email image slug fullName comment assign op date createdBy",
    populate: { path: "assign createdBy", select: "fullName email image slug" },
  });
  if (!ticket) return next(new AppError("No ticket found with this id", 404));
  if (ticket.status === "CLOSED") return next(new AppError("This ticket is already closed", 403));

  // Not an assigned user
  if (
    !(ticket.assignedTo as EmployeeModel[]).some(
      (user) => user._id.toString() === req.employee._id.toString()
    )
  ) {
    return next(new AppError("You are not authorized to close this ticket", 403));
  }
  ticket.status = "CLOSED";
  ticket.closedBy = req.employee._id;
  ticket.closedAt = new Date();
  await ticket.save();
  await ticket.populate({ path: "closedBy", select: "email image slug fullName" }).execPopulate();
  res.sendJson(200, { ticket });
  ticketEvent.close(ticket);
});
