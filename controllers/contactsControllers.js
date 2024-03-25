import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import fs from "fs/promises";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsService.getAllContacts(
    { owner },
    { skip, limit }
  );

  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getOne({ _id: id, owner });
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.deleteOneContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Contact not found`);
  }

  res.json({
    message: "Delete success",
  });
};

export const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("public", avatar, filename);
  const result = await contactsService.addContact({ ...req.body, owner });

  res.status(201).json(result);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateOneContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Contact not found`);
  }

  res.json(result);
};

export const updateFavorite = async (req, res) => {
  const { error } = updateFavoriteSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
