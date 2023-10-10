const { Contact } = require("../models/contacts.models");
const { catchAsync } = require("../utils/index");
// const path = require("path");
const ImageService = require("../services/imageService");

const getContact = catchAsync(async (req, res) => {
  try {
    const getContacts = await Contact.find();

    return res.status(200).json(getContacts);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const getContactById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const getContactById = await Contact.findById(id);

    return res.status(200).json(getContactById);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const createContact = catchAsync(async (req, res) => {
  try {
    const { body } = req;
    const newContact = await Contact.create(body);

    return res.status(201).json(newContact);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const updateContactById = catchAsync(async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const updateContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updateContact) {
      return res.status(400).json({ error: "missing fields" });
    }

    return res.status(200).json(updateContact);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const deleteContact = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const deleteContact = await Contact.findByIdAndRemove(id);
    if (deleteContact) {
      return res
        .status(200)
        .json({ message: `contact by id ${id} is deleted` });
    }

    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const updateStatusContact = catchAsync(async (req, res) => {
  try {
    const { body } = req;
    const { id } = req.params;

    const updateStatusByContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updateStatusByContact) {
      return res.status(404).json({ error: "not found..." });
    }

    return res.status(200).json(updateStatusByContact);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

const getMe = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

const updateMe = catchAsync(async (req, res) => {
  
  // console.log(req.body, req.user, req.file);
  // console.log(userData, user, file);
 

  try {
    if (req.file) {
      // req.user.avatarURL = req.file.path.replace('public', '');
      req.user.avatarURL = await ImageService.save(
        req.file,
        { maxSize: 1.3, width: 250, height: 250 },
        "public",
        "avatars",
        req.user.id
      );
    }

    Object.keys(req.body).forEach((key) => {
      req.user[key] = req.body[key];
    });

    const user = req.user;
    user.save();

    return res.status(200).json({ message: "Success", user });
  } catch (error) {
    
    return res.status(401).json({ message: error.message });
  }
});

module.exports = {
  getContact,
  getContactById,
  createContact,
  updateContactById,
  deleteContact,
  updateStatusContact,
  getMe,
  updateMe,
};
