import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface NoteDocument extends mongoose.Document {
  user: UserDocument["_id"];
  noteId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema(
  {
    noteId: {
      type: String,
      required: true,
      unique: true,
      default: () => `note_${nanoid()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const NoteModel = mongoose.model<NoteDocument>("Note", noteSchema);

export default NoteModel;
