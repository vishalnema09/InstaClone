import { Server } from "socket.io";
import userModel from "../models/user.js";

function initSocket(server) {
  console.log("Socket.io initialized");

  const io = new Server(server);
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.token;

      if (!token) {
        return next(new Error("Token is required"));
      }

      const decodedToken = userModel.verifyToken(token);

      const user = await userModel.findById(decodedToken._id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.user._id.toString());
    socket.on("disconnect", () => {
      console.log("User disconnected");
      socket.leave(socket.user._id.toString());
    });
    console.log("User connected");
  });
}

export default initSocket;
