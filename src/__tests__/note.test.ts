import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import { createNote } from "../service/note.service";
import { signJwt } from "../utils/jwt";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const notePayload = {
  user: userId,
  title: "Lens",
  description:
    "Designed",
};

export const userPayload = {
  _id: userId,
  email: "Omar.joe@example.com",
  name: "Omar Joe",
};

describe("note", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get note route", () => {
    describe("given the note does not exist", () => {
      it("should return a 404", async () => {
        const noteId = "note-123";

        await supertest(app).get(`/api/notes/${noteId}`).expect(404);
      });
    });

    describe("given the note does exist", () => {
      it("should return a 200 status and the note", async () => {
        // @ts-ignore
        const note = await createNote(notePayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/notes/${note.noteId}`
        );

        expect(statusCode).toBe(200);

        expect(body.noteId).toBe(note.noteId);
      });
    });
  });

  describe("get all notes route", () => {
    describe("given notes exist", () => {
      it("should return a 200", async () => {
        const jwt = signJwt(userPayload);

        const { statusCode, body } = await supertest(app)
          .get("/api/notes")
          .set("Authorization", `Bearer ${jwt}`)
          .send(notePayload);

        expect(statusCode).toBe(200);
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              __v: 0,
              _id: expect.any(String),
              createdAt: expect.any(String),
              description: expect.any(String),
              noteId: expect.any(String),
              title: expect.any(String),
              updatedAt: expect.any(String),
              user: expect.any(String),
            }),
          ])
        );
      });
    });
  });

  describe("given the user is logged in do a search", () => {
    it("should return a 200 and return the searched note", async () => {
      const jwt = signJwt(userPayload);

      const { statusCode, body } = await supertest(app)
        .get("/api/search")
        .set("Authorization", `Bearer ${jwt}`)
        .send(notePayload);

      expect(statusCode).toBe(200);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            __v: 0,
            _id: expect.any(String),
            createdAt: expect.any(String),
            description: expect.any(String),
            noteId: expect.any(String),
            title: expect.any(String),
            updatedAt: expect.any(String),
            user: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("create note route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/notes");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the note", async () => {
        const jwt = signJwt(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/notes")
          .set("Authorization", `Bearer ${jwt}`)
          .send(notePayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            "Designed",
          noteId: expect.any(String),
          title: "Lens",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
