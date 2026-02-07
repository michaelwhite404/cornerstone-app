import { authController as v2auth, leaveController } from "@controllers/v2";
import { Router } from "express";

const leaveRouter = Router();

leaveRouter.use(v2auth.protect);

leaveRouter.route("/").get(leaveController.getAllLeaves).post(leaveController.createLeave);

leaveRouter.post("/generate-report", leaveController.generateReport);

leaveRouter.post("/:id/approve", leaveController.checkCanApprove, leaveController.approveLeave);

leaveRouter.route("/:id").get(leaveController.getLeave);

export default leaveRouter;
