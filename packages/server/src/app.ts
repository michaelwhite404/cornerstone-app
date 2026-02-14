import express, { RequestHandler } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import passport from "passport";
import { createHandler } from "graphql-http/lib/use/express";
import subdomain from "express-subdomain";

import { AppError, catchAsync, s3, xssSanitize, mongoSanitize } from "@utils";
import globalErrorHandler from "@controllers/errorController";
import apiRouter from "./routes/apiRoutes";
import authRouter from "./routes/authRoutes";
import pdfRouter from "./routes/pdfRoutes";
import csvRouter from "./routes/csvRoutes";
import "./config/passport-setup";
import schema from "./graphql/schema";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));

// 1.) MIDDLEWARES
// Serving static files

/* Redirect http to https */
app.get("/{*path}", function (req, res, next) {
  if ("https" !== req.headers["x-forwarded-proto"] && "production" === process.env.NODE_ENV) {
    res.redirect("https://" + req.hostname + req.url);
  } else {
    // Continue to other routes if we're not redirecting
    next();
  }
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  res.sendJson = (statusCode: number, dataObject: any) => {
    return res.status(statusCode).json({
      status: "success",
      requestedAt: req.requestTime,
      data: dataObject,
    });
  };
  next();
});

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(passport.initialize() as unknown as RequestHandler);

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize);

// Data Sanitization against XSS attacks
app.use(xssSanitize);

app.use(compression() as unknown as RequestHandler);

app.use(subdomain("api", apiRouter) as unknown as RequestHandler);
app.use("/api", apiRouter);
app.all("/graphql", createHandler({ schema }) as unknown as RequestHandler);
app.use("/auth", authRouter);
app.use("/pdf", pdfRouter);
app.use("/csv", csvRouter);
app.get(
  "/images/*key",
  catchAsync(async (req, res, next) => {
    const key = req.params.key as string;
    const readStream = s3.getFileStream(key);
    readStream.on("error", () => {
      return next(new AppError("No image was found", 404));
    });
    readStream.pipe(res);
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../../client/build")));
  app.get("/{*path}", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "../public")));
}

app.all("/{*path}", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
