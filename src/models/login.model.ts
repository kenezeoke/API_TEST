import mongoose from "mongoose";
import { UserDocument } from "./user.model";

export interface LoginDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const loginSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

const LoginModel = mongoose.model<LoginDocument>("Login", loginSchema);

export default LoginModel;
