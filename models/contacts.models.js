// const { string } = require("joi");
const { model, Schema } = require("mongoose");

const contact = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contacts", contact);

module.exports = {
  Contact
};
