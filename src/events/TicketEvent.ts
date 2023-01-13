import {
  EmployeeDocument,
  TicketAssignUpdateDocument,
  TicketCommentUpdateDocument,
  TicketDocument,
} from "@@types/models";
import { Ticket, TicketAssignUpdate, TicketCommentUpdate, UserSetting } from "@models";
import { chat, Email, formatUrl } from "@utils";
import capitalize from "capitalize";
import { chat_v1 } from "googleapis";

const URL =
  process.env.NODE_ENV! === "development"
    ? "http://localhost:3000"
    : "https://app.cornerstone-schools.org";

interface AssignMessageData {
  ticket: TicketDocument;
  parent: string;
  text: string;
  headerTitle: string;
}

interface CommentData {
  usersToNotify: EmployeeDocument[];
  commenter: EmployeeDocument;
  ticket: TicketDocument;
  comment: string;
}

class TicketEvent {
  private createAssignChatMessage(
    data: AssignMessageData
  ): chat_v1.Params$Resource$Spaces$Messages$Create {
    const { ticket, parent, text, headerTitle } = data;
    return {
      parent,
      requestBody: {
        text,
        cards: [
          {
            header: {
              title: headerTitle,
              subtitle: `#${ticket.ticketId}`,
              imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
            },
            sections: [
              {
                widgets: [
                  { keyValue: { topLabel: "Title", content: ticket.title } },
                  { keyValue: { topLabel: "Description", content: ticket.description } },
                  {
                    keyValue: {
                      topLabel: "Priority",
                      content: capitalize(ticket.priority.toLowerCase()),
                    },
                  },
                ],
              },
              {
                widgets: [
                  {
                    buttons: [
                      {
                        textButton: {
                          text: "OPEN IN APP",
                          onClick: {
                            openLink: {
                              url: `${URL}/tickets/${ticket.ticketId}`,
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  }

  async submit(ticket: TicketDocument) {
    ticket = await Ticket.populate(ticket, { path: "assignedTo submittedBy" });
    const assignedUsers = ticket.assignedTo as EmployeeDocument[];
    this.sendSubmitChatMessages(assignedUsers, ticket);
    this.sendSubmitEmails(assignedUsers, ticket);
  }

  private async sendSubmitEmails(users: EmployeeDocument[], ticket: TicketDocument) {
    const sendEmail = (user: EmployeeDocument) =>
      new Email(user, formatUrl(`/tickets/${ticket.ticketId}`)).sendTicketAssign(ticket, true);
    // Get the users' email setting
    const userSettings = await UserSetting.find({
      user: { $in: users },
      settingName: "setting.user.notification.TicketAssignEmail",
    });
    users.forEach((user) => {
      // Get the setting for a specific user
      const emailSetting = userSettings.find(
        (setting) => setting.user.toString() === user._id.toString()
      );
      // If setting not set or set to true, set email
      if (!emailSetting || emailSetting.value.ticketAssignEmail) sendEmail(user);
    });
  }

  private sendSubmitChatMessages(users: EmployeeDocument[], ticket: TicketDocument) {
    const spaces = users.filter((e) => e.space).map((e) => e.space!);
    spaces.forEach((space) => {
      const params = this.createAssignChatMessage({
        ticket,
        parent: space,
        text: `${ticket.submittedBy.fullName} has submitted a ticket`,
        headerTitle: "New Ticket",
      });
      chat.spaces.messages.create(params).catch();
    });
  }

  async assign(update: TicketAssignUpdateDocument) {
    // Only send if user is being added
    if (update.op === "REMOVE") return;
    const { ticket, assign: user } = await TicketAssignUpdate.populate(update, "ticket assign");
    this.sendAssignChat(user, ticket);
    this.sendAssignEmail(user, ticket);
  }

  private async sendAssignEmail(user: EmployeeDocument, ticket: TicketDocument) {
    const sendEmail = (user: EmployeeDocument) =>
      new Email(user, formatUrl(`/tickets/${ticket.ticketId}`)).sendTicketAssign(ticket, false);
    const emailSetting = await UserSetting.findOne({
      user,
      settingName: "setting.user.notification.TicketAssignEmail",
    });
    if (!emailSetting || emailSetting.value.ticketAssignEmail) sendEmail(user);
  }

  private sendAssignChat(user: EmployeeDocument, ticket: TicketDocument) {
    if (!user.space) return;
    const params = this.createAssignChatMessage({
      ticket,
      parent: user.space,
      text: "You have been assigned to a ticket",
      headerTitle: "Assigned Ticket",
    });
    chat.spaces.messages.create(params).catch();
  }

  async comment(update: TicketCommentUpdateDocument) {
    const { createdBy, ticket } = await TicketCommentUpdate.populate(update, {
      path: "ticket createdBy",
      populate: { path: "assignedTo submittedBy" },
    });
    const users: EmployeeDocument[] = [...ticket.assignedTo, ticket.submittedBy];
    const data: CommentData = {
      comment: update.comment,
      commenter: createdBy as EmployeeDocument,
      ticket,
      usersToNotify: users.filter((user) => user._id.toString() !== createdBy._id.toString()),
    };
    this.sendCommentChats(data);
    this.sendCommentEmails(data);
  }

  private async sendCommentEmails(data: CommentData) {
    const { comment, commenter, ticket, usersToNotify } = data;
    const sendEmail = (user: EmployeeDocument) => {
      new Email(user, formatUrl(`/tickets/${ticket.ticketId}`)).sendTicketComment(
        ticket,
        commenter,
        comment
      );
    };
    const userSettings = await UserSetting.find({
      user: { $in: usersToNotify },
      settingName: "setting.user.notification.TicketCommentEmail",
    });
    usersToNotify.forEach((user) => {
      // Get the setting for a specific user
      const emailSetting = userSettings.find(
        (setting) => setting.user.toString() === user._id.toString()
      );
      // If setting not set or set to true, set email
      if (!emailSetting || emailSetting.value.ticketCommentEmail) sendEmail(user);
    });
  }

  private sendCommentChats(data: CommentData) {
    const { comment, commenter, ticket, usersToNotify } = data;

    const params = (space: string): chat_v1.Params$Resource$Spaces$Messages$Create => ({
      parent: space,
      requestBody: {
        text: `${commenter.fullName} left a comment on ticket #${ticket.ticketId}`,
        cards: [
          {
            header: {
              title: "Ticket Comment",
              subtitle: `#${ticket.ticketId}`,
              imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
            },
            sections: [
              {
                widgets: [
                  { keyValue: { topLabel: "Title", content: ticket.title } },
                  { keyValue: { topLabel: "Comment", content: comment } },
                ],
              },
              {
                widgets: [
                  {
                    buttons: [
                      {
                        textButton: {
                          text: "OPEN IN APP",
                          onClick: {
                            openLink: {
                              url: `${URL}/tickets/${ticket.ticketId}`,
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    usersToNotify.forEach((user) => {
      if (!user.space) return;
      chat.spaces.messages.create(params(user.space)).catch();
    });
  }

  async close(ticket: TicketDocument) {
    await ticket.populate("assignedTo submittedBy closedBy").execPopulate();
    const closerId = ticket.closedBy!._id.toString();

    const users = [...(ticket.assignedTo as EmployeeDocument[])];
    if (!users.some((user) => user._id.toString() === closerId)) users.push(ticket.submittedBy);

    const { closer, rest } = users.reduce(
      (value, currEmployee) => {
        currEmployee._id.toString() === closerId
          ? (value.closer = currEmployee)
          : value.rest.push(currEmployee);
        return value;
      },
      { closer: undefined, rest: [] } as {
        closer?: EmployeeDocument;
        rest: EmployeeDocument[];
      }
    );

    rest.forEach(async (user) => {
      if (!user.space) return;
      await chat.spaces.messages.create({
        parent: user.space,
        requestBody: {
          text: `${closer?.fullName} has closed ticket #${ticket.ticketId}`,
          cards: [
            {
              header: {
                title: "Closed Ticket",
                subtitle: `#${ticket.ticketId}`,
                imageUrl: "https://i.ibb.co/Ypsrycx/Ticket-Blue.png",
              },
              sections: [
                {
                  widgets: [
                    { keyValue: { topLabel: "Title", content: ticket.title } },
                    { keyValue: { topLabel: "Description", content: ticket.description } },
                    {
                      keyValue: {
                        topLabel: "Priority",
                        content: capitalize(ticket.priority.toLowerCase()),
                      },
                    },
                    { keyValue: { topLabel: "Status", content: "Closed" } },
                  ],
                },
                {
                  widgets: [
                    {
                      buttons: [
                        {
                          textButton: {
                            text: "OPEN IN APP",
                            onClick: {
                              openLink: {
                                url: `${URL}/tickets/${ticket.ticketId}`,
                              },
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    });
  }
}

export const ticketEvent = new TicketEvent();
