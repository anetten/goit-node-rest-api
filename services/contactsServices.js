import Contact from "../models/Contact.js";

const listContact = (filter = {}, query = {}) => Contact.find(filter, query);

const getContactById = (id) => Contact.findById(id);
const getOne = (filter) => Contact.findOne(filter);

const addContact = (data) => Contact.create(data);

const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);

const updateOneContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

const deleteContact = (id) => Contact.findByIdAndDelete(id);

const deleteOneContact = (filter) => Contact.findOneAndDelete(filter);

export default {
  listContact,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  getOne,
  updateOneContact,
  deleteOneContact,
};
