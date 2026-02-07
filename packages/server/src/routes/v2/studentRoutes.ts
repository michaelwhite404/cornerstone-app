import { Router } from "express";
import { studentController, authController } from "@controllers/v2";
const { protect } = authController;

const studentRouter = Router();

studentRouter.use(protect);

studentRouter
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createStudent);

studentRouter.get("/group", studentController.groupStudentsByGrade);
studentRouter.patch("/update-password", studentController.updateStudentGooglePassword);
studentRouter
  .route("/:id")
  .get(studentController.getOneStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

export default studentRouter;
