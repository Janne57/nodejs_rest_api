const express = require("express");
const router = express.Router();

const contact = require("../../models/contacts");
const { AppError, catchAsync, userValidator } = require("../../utils/index");

router.get("/",
  catchAsync(async (req, res, next) => {
    try {
      const resContacts = await contact.listContacts();

      return res.status(200).json(resContacts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
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
  })
);

router.post(
  "/",
  catchAsync(async (req, res, next) => {
    const { error, value } = userValidator.dataValidator(req.body);

    if (error) {
      console.log(error);

      throw new AppError(400, "missing required name field");
      // return res.status(400).json({ message: "missing required name field" });
    }

    const { name, email, phone } = value;

    try {
      const body = {
        name,
        email,
        phone,
      };

      const contactAdd = await contact.addContact(body);

      if (!contactAdd) {
        return res.status(400).json({ error: "Failed to add contact" });
      }

      return res.status(201).json(contactAdd);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

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

router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { error, value } = userValidator.dataValidator(req.body);

    if (error) {
      console.log(error);

      // throw new AppError(400, "missing required name field");
      return res.status(400).json({ message: "missing fields" });
    }

    const { name, email, phone } = value;
    const updateBody = {
      name,
      email,
      phone,
    };

    try {
      const { id } = req.params;
      const contactUpdate = await contact.updateContact(id, updateBody);

      if (contactUpdate) {
        return res.status(200).json(contactUpdate);
      }

      return res.status(404).json({ message: "Not found" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

module.exports = router;
