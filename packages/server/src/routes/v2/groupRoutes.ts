import { Router } from "express";
import { groupController, authController as v2auth } from "@controllers/v2";

const groupRouter = Router();

groupRouter.use(v2auth.protect);
groupRouter.use(v2auth.restrictTo("Super Admin", "Admin"));

groupRouter.route("/").get(groupController.getAllGroups).post(groupController.createGroup);

groupRouter.route("/:group").get(groupController.getGroup).patch(groupController.updateGroup);

groupRouter.route("/:group/members").post(groupController.addMembersToGroup);

export default groupRouter;
