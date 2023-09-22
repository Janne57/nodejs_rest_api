const express = require("express");
const router = express.Router();
const contact = require("../../models/contacts");

const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const resContacts = await contact.listContacts();

    return res.status(200).json(resContacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contactById = await contact.getContactById(id);
    if (!contactById) {

      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(contactById);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res, next) => {

  try {
    const { body } = req;
    const errors = contactSchema.validate(body);
    console.log(errors);
    
    if ( errors.length > 0 ) {
 
      return res.status(400).json({"message": "missing fields"});
    }
    else {
      const contactAdd = await contact.addContact(body);
      if (contactAdd) {

        return res.status(201).json(contactAdd);
      }
    }
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactDelete = await contact.removeContact(id);
    if (contactDelete) {

      return res.status(200).json({ message: "contact deleted" });
    } else {
      
      return res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req || {};

    // if (req.body) {
    if (body === {}) {
      return res.status(400).json({ message: "missing fields" });
    } else {
      //   return res.status(400).json({"message": "missing request body"})
      // }
      // }
      const contactUpdate = await contact.updateContact(id, body);

      if (contactUpdate) {

        return res.status(200).json(contactUpdate);
      } else {

        return res.status(404).json({ message: "Not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
