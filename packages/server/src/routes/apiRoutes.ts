import { AppError } from "@utils";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import v1Router from "./v1/v1Routes";
import v2Router from "./v2";

const router = Router();

const limiter = rateLimit({
  max: 300,
  windowMs: 60000,
  message: "To many requests from this IP, please try again in one minute",
});

router.use(limiter);
router.use("/v1", v1Router);
router.use(["/v2", "/"], v2Router);

router.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default router;
