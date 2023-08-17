import { Request, Response } from "express";
import config from "config";
import {
  createLogin,
  findNotes,
} from "../service/login.service";
import { validatePassword } from "../service/signup.service";
import { signJwt } from "../utils/jwt";

export async function createUserLoginHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const login = await createLogin(user._id, req.get("user-agent") || "");

  // create an access token

  const accessToken = signJwt(
    { ...user, login: login._id },
    { expiresIn: config.get("accessToken") } // 15 minutes
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, login: login._id },
    { expiresIn: config.get("refreshToken") } // 15 minutes
  );

  // return access & refresh tokens

  return res.send({ accessToken, refreshToken });
}

export async function getUserNotesHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const notes = await findNotes({ user: userId, valid: true });

  return res.send(notes);
}
