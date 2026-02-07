import { Router } from "express";
import { roomController, authController } from "@controllers/v2";

const router = Router();

router.use(authController.protect);

router.route("/").get(roomController.getAllRooms).post(roomController.createRoom);
router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
