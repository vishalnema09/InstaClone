import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is already exists"],
    trim: true,
    lowercase: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [15, "Username must be at most 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already exists"],
    trim: true,
    lowercase: true,
    minlength: [6, "Email must be at least 3 characters"],
    maxlength: [40, "Email must be at most 50 characters"],
  },
  profileImage: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStCJpmc7wNF8Ti2Tuh_hcIRZUGOc23KBTx2A&s",
  },
  password: {
    type: String,
    select: false,
  },
});

userSchema.statics.hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password) {
  if (!password) {
    throw new Error("Password is required");
  }

  if (!this.password) {
    throw new Error("Password is required");
  }
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRATION_TIME,
    }
  );
  return token;
};

userSchema.statics.verifyToken = function (token) {
  if (!token) {
    throw new Error("Token is required");
  }
  return jwt.verify(token, config.JWT_SECRET);
};
const userModel = mongoose.model("user", userSchema);



export default userModel;