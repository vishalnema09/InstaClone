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

router.get("/profile", userMiddleware.authUser, (req, res) => {
  res.json(req.user);
});

router.get(
  "/logout",
  userMiddleware.authUser,
  userController.logoutUserController
);

router.get(
  "/get-messages",
  userMiddleware.authUser,
  userController.getMessagesController
);
export default router;
