import { Router } from "express";
import { singleTextbookController, helpers } from "@controllers/v2";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(helpers.addKeyToQuery("textbookSet"), singleTextbookController.getAllBooks)
  .post(helpers.addParamsToBody("textbookSet"), singleTextbookController.createBook);

router.post(
  "/bulk",
  singleTextbookController.addTextbookSetToBody,
  singleTextbookController.createBooks
);

router.post("/check-out", singleTextbookController.checkOutTextbooks);
router.patch("/check-in", singleTextbookController.checkInTextbooks);

router.post("/check-out/student/:student_id", singleTextbookController.checkOutTextbookByStudent);
router.patch("/check-in/student/:student_id", singleTextbookController.checkInTextbookByStudent);

router
  .route("/:_id")
  .get(singleTextbookController.getBook)
  .patch(singleTextbookController.updateBook);

export default router;
