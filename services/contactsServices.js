import Contact from "../models/Contact.js";

const listContact = () => Contact.find();

const getContactById = (id) => Contact.findOne({ _id });

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
