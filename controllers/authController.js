import jwt from "jsonwebtoken";

import * as authService from "../services/authService.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

import fs from "fs/promises";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);

  const newUser = await authService.signup({
    ...req.body,
    avatarURL,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUser({ email });

  console.log(user);
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const comparePassword = await authService.validatePassword(
    password,
    user.password
  );
  console.log(comparePassword);

  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authService.updateUser({ _id: id }, { token });
  res.json({ token });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authService.updateUser({ _id }, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;
  res.json({
    username,
    email,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, Jimp.AUTO);
    })
    .then((image) => {
      return image.write(resultUpload);
    });

  await fs.unlink(tempUpload);
  const avatarURL = path.join("avatars", filename);
  console.log("avatarURL", avatarURL);
  await authService.updateUser(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
