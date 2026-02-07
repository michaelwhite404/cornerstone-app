import { Router } from "express";
import { authController, ticketController } from "@controllers/v2";
const { protect } = authController;

const ticketRouter = Router();

ticketRouter.use(protect);
ticketRouter.route("/").get(ticketController.getAllTickets).post(ticketController.createTicket);
ticketRouter.route("/:id").get(ticketController.getTicket);
ticketRouter.post("/:id/update", ticketController.addTicketUpdate);
ticketRouter.post("/:id/close", ticketController.closeTicket);

export default ticketRouter;
