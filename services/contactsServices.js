import Contact from "../models/Contact.js";

const listContact = (filter = {}) => Contact.find(filter);

const getContactById = (filter) => Contact.findOne(filter);

const addContact = (data) => Contact.create(data);

const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);

const deleteContact = (id) => Contact.findByIdAndDelete(id);

export default {
  listContact,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
};
