import { Express, Request, Response } from "express";
import {
  createNoteHandler,
  getNoteHandler,
  updateNoteHandler,
  getAllNotesHandler,
  searchNoteHandler,
  shareNoteHandler
} from "./controller/note.controller";
import {
  createUserLoginHandler,
  
} from "./controller/login.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import {
  createNoteSchema,
  deleteNoteSchema,
  getNoteSchema,
  updateNoteSchema,
  
} from "./schema/note.schema";
import { createLoginSchema } from "./schema/login.schema";
import { createUserSchema } from "./schema/user.schema";


function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => res.sendStatus(200));


  app.post("/api/auth/signup", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/auth/login",
    validateResource(createLoginSchema),
    createUserLoginHandler
  );

  app.post(
    "/api/notes",
    [requireUser, validateResource(createNoteSchema)],
    createNoteHandler
  );

  
  app.post(
    "/api/notes/:id/share",
    [requireUser, validateResource(createNoteSchema)],
    shareNoteHandler
  );

  app.put(
    "/api/notes/:noteId",
    [requireUser, validateResource(updateNoteSchema)],
    updateNoteHandler
  );
  
  
  app.get("/api/notes", requireUser, getAllNotesHandler);

  app.get( "/api/search", requireUser, searchNoteHandler);

  app.get(
    "/api/notes/:noteId",
    validateResource(getNoteSchema),
    getNoteHandler
  );

  app.delete(
    "/api/notes/:noteId",
    [requireUser, validateResource(deleteNoteSchema)],
    getNoteHandler
  );
}

export default routes;
