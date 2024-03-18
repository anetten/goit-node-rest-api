import express from "express";

import authController from "../controllers/authController.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

import { userLoginSchema, userSignupSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/users/register",
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post(
  "/users/login",
  validateBody(userLoginSchema),
  authController.login
);

authRouter.post("/users/logout", authenticate, authController.logout);

export default authRouter;
