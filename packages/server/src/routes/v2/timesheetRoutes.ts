import { Router } from "express";
import { authController, timesheetController } from "@controllers/v2";

const { protect } = authController;
const {
  approveTimesheets,
  createTimeSheetEntry,
  deleteTimesheetEntry,
  getAllTimeSheetEntries,
  getOneTimesheetEntry,
  updateTimesheetEntry,
} = timesheetController;

const router = Router();

router.use(protect);

router.route("/").get(getAllTimeSheetEntries).post(createTimeSheetEntry);

router.patch("/approve", approveTimesheets);

router
  .route("/:id")
  .get(getOneTimesheetEntry)
  .patch(updateTimesheetEntry)
  .delete(deleteTimesheetEntry);

export default router;
