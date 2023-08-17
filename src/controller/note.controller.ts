import { Request, Response } from "express";
import {
  CreateNoteInput,
  UpdateNoteInput,
} from "../schema/note.schema";
import {
  createNote,
  deleteNote,
  findAndUpdateNote,
  findNote,
  findAllNotes
} from "../service/note.service";

export async function createNoteHandler(
  req: Request<{}, {}, CreateNoteInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const body = req.body;

  const note = await createNote({ ...body, user: userId });

  return res.send(note);
}

export async function shareNoteHandler(
  req: Request<{}, {}, CreateNoteInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const body = req.body;

  const note = await createNote({ ...body, user: userId });

  return res.send(note);
}

export async function updateNoteHandler(
  req: Request<UpdateNoteInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;

  const noteId = req.params.noteId;
  const update = req.body;

  const note = await findNote({ noteId });

  if (!note) {
    return res.sendStatus(404);
  }

  if (String(note.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedNote = await findAndUpdateNote({ noteId }, update, {
    new: true,
  });

  return res.send(updatedNote);
}

export async function getNoteHandler(
  req: Request<UpdateNoteInput["params"]>,
  res: Response
) {
  const noteId = req.params.noteId;
  const note = await findNote({ noteId });

  if (!note) {
    return res.sendStatus(404);
  }

  return res.send(note);
}

export async function searchNoteHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const {q} = req.query

  let notes = await findAllNotes({ user: userId, valid: true });
  
  if (!notes) {
    return res.sendStatus(404);
  }
  if (q){
      notes = notes.filter((note)=>{
      return note.title.startsWith(String(q))})
  }
  
  if (notes.length < 1) {
    // res.status(200).send('no notes matched your search');
    return res.status(200).json({ sucess: true, data: [] })
  }
  return res.send(notes);
}

export async function getAllNotesHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const notes = await findAllNotes({ user: userId, valid: true });

  return res.send(notes);
}

export async function deleteNoteHandler(
  req: Request<UpdateNoteInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const noteId = req.params.noteId;

  const note = await findNote({ noteId });

  if (!note) {
    return res.sendStatus(404);
  }

  if (String(note.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteNote({ noteId });

  return res.sendStatus(200);
}
