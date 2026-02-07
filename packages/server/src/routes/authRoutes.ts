import { Router } from "express";
import passport from "passport";
import * as authController from "../controllers/v1/authController";

const router = Router();

router.get("/login", (_, res) => {
  res.send("login");
});

router.get("/logout", (_, res) => {
  // handle with passport
  res.send("logging out");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "openid",
      "https://www.googleapis.com/auth/user.organization.read",
      "https://www.googleapis.com/auth/directory.readonly",
    ],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  authController.createSendGoogleToken
);

export default router;
