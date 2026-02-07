import { Router } from "express";
import { authController, textbookController } from "@controllers/v2";
import singleTextbookRouter from "./singleTextbookRoutes";
const { protect } = authController;

const router = Router();

router.use(protect);

router.use("/books", singleTextbookRouter);
router.use("/:textbookSet/books", singleTextbookRouter);

router.route("/").get(textbookController.getAllTextbooks).post(textbookController.createTextbook);

router.post("/books/both", textbookController.createSetAndBooks);

router
  .route("/:id")
  .get(textbookController.getOneTextbook)
  .patch(textbookController.updateTextbook)
  .delete(textbookController.deleteTextbook);

export default router;
