import userModel from "../models/user.js";
import messageModel from "../models/message.model.js";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js";
import redis from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser({ username, email, password });
    const token = user.generateToken();

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export const loginUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const user = await userService.loginUser({ email, password });
    const token = user.generateToken();
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(401).json(error.message);
  }
};

export const logoutUserController = async (req, res) => {
  const timeRemainingForToken = req.tokenData.exp * 1000 - Date.now();
  await redis.set(
    `blacklist:${req.tokenData.token}`,
    true,
    "EX",
    Math.floor(timeRemainingForToken / 1000)
  );
  res.send("logged out");
};
export const getMessagesController = async (req, res) => {
  try {
    const messages = await messageModel.find({
      $or: [
        {
          sender: req.user._id,
          receiver: req.query.userId,
        },
        {
          sender: req.query.userId,
          receiver: req.user._id,
        },
      ],
    });

    res.status(200).json({
      messages,
      messagesCount: messages.length,
      message: "Messages are successfully fetched",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
