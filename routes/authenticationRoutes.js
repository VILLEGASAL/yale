import express from "express";
import {
  getSignupPage,
  signupUser,
  getLoginPage,
  getHomePage,
  checkAuthenticated,
  preventAccessIfAuthenticated,
  verifyUser,
} from "../controller/authenticationController.js";
import passport from "passport";

export const authenticationRouter = express.Router();

authenticationRouter.get("/", preventAccessIfAuthenticated, getSignupPage);

authenticationRouter.post("/", signupUser);

authenticationRouter.get("/home", checkAuthenticated, getHomePage);

authenticationRouter.get("/login", preventAccessIfAuthenticated, getLoginPage);

authenticationRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

authenticationRouter.post("/verify-user", checkAuthenticated, verifyUser);

authenticationRouter.delete("/logout", (req, res) => {

  req.logOut(() => {

    req.session.destroy(() => {

      res.redirect("/login");
    });

  });
  
});
