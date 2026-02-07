import { Router } from "express";
import { departmentMemberController } from "@controllers/v2";

const {
  getAllDepartmentMembers,
  createDepartmentMembers,
  getDepartmentMember,
  removeDepartmentMember,
  updateDepartmentMember,
} = departmentMemberController;

const memberRouter = Router({ mergeParams: true });

memberRouter.route("/").get(getAllDepartmentMembers).post(createDepartmentMembers);
memberRouter
  .route("/:id")
  .get(getDepartmentMember)
  .delete(removeDepartmentMember)
  .patch(updateDepartmentMember);

export default memberRouter;
