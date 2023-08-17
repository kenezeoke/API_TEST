import { object, number, string, TypeOf } from "zod";
const payload = {
  body: object({
    title: string({
      required_error: "Title is required",
    }),
    description: string({
      required_error: "Description is required",
    }).max(120, "Description should be at most 120 characters long"),
  }),
};

const params = {
  params: object({
    noteId: string({
      required_error: "noteId is required",
    }),
  }),
};

export const createNoteSchema = object({
  ...payload,
});

export const updateNoteSchema = object({
  ...payload,
  ...params,
});

export const deleteNoteSchema = object({
  ...params,
});

export const getNoteSchema = object({
  ...params,
});

export const searchNoteSchema = object({
  ...params,
});

export const getUserNotesSchema = object({
  ...params,
});
export type CreateNoteInput = TypeOf<typeof createNoteSchema>;
export type UpdateNoteInput = TypeOf<typeof updateNoteSchema>;
export type ReadNoteInput = TypeOf<typeof getNoteSchema>;
export type DeleteNoteInput = TypeOf<typeof deleteNoteSchema>;
export type ReadNotesInput = TypeOf<typeof getUserNotesSchema>;
export type SearchNotesInput = TypeOf<typeof searchNoteSchema>;
