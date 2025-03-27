import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import * as userMiddleware from "../middlewares/user.middleware.js";
const router = Router();

router.post(
  "/register",
  userMiddleware.registerUserValidator,
  userController.createUserController
);
router.post(
  "/login",
  userMiddleware.loginUserValidator,
  userController.loginUserController
);

export default router;
