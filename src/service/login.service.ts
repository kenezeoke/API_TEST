import { get } from "lodash";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import LoginModel, { LoginDocument } from "../models/login.model";
import { verifyJwt, signJwt } from "../utils/jwt";
import { findUser } from "./signup.service";

export async function createLogin(userId: string, userAgent: string) {
  const login = await LoginModel.create({ user: userId, userAgent });

  return login.toJSON();
}

export async function findNotes(query: FilterQuery<LoginDocument>) {
  return LoginModel.find(query).lean();
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: any;
}) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "login")) return false;

  const login = await LoginModel.findById(get(decoded, "login"));

  if (!login || !login.valid) return false;

  const user = await findUser({ _id: login.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, login: login._id },
    { expiresIn: config.get("accessToken") } // 15 minutes
  );

  return accessToken;
}
