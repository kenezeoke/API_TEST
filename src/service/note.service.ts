import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import NoteModel, { NoteDocument } from "../models/note.model";

export async function createNote(
  input: DocumentDefinition<
    Omit<NoteDocument, "createdAt" | "updatedAt" | "noteId">
  >
) {
  return NoteModel.create(input);
}

export async function findNote(
  query: FilterQuery<NoteDocument>,
  options: QueryOptions = { lean: true }
) {
  return NoteModel.findOne(query, {}, options);
}

export async function findAllNotes(
  query: FilterQuery<NoteDocument>
) {
  return NoteModel.find(query).lean();
}

export async function searchNote(
  query: FilterQuery<NoteDocument>
) {
  return NoteModel.find(query).lean();
}



export async function findAndUpdateNote(
  query: FilterQuery<NoteDocument>,
  update: UpdateQuery<NoteDocument>,
  options: QueryOptions
) {
  return NoteModel.findOneAndUpdate(query, update, options);
}

export async function deleteNote(query: FilterQuery<NoteDocument>) {
  return NoteModel.deleteOne(query);
}
