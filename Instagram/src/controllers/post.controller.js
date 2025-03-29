import { generateCaptionFromImageBuffer } from "../services/ai.service.js";
import { uploadFile } from "../services/cloudStorage.service.js";
import postModel from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  const imageBuffer = req.file.buffer;

  const [caption, fileData] = await Promise.all([
    generateCaptionFromImageBuffer(imageBuffer),
    uploadFile(imageBuffer),
  ]);
  const newPost = await postModel.create({
    caption,
    media: fileData,
    author: req.user._id,
  });
  res.status(201).json({
    fileData,
    post: newPost,
    message: "Post created successfully",
  });
};
