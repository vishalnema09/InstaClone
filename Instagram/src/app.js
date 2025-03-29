import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import postsRoutes from "./routes/posts.routes.js"

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/ai", aiRoutes);
app.use('/posts', postsRoutes);

export default app;
