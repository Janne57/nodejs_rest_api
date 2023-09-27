const { Types } = require("mongoose");
const { Contact } = require("../models/contacts.models");
const { AppError, catchAsync, userValidator } = require("../utils/index");

exports.checkUserId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) {
    throw new AppError(404, "User not found..");
  }

  const userExists = await Contact.exists({ _id: id });

  if (!userExists) {
    throw new AppError(404, "User not found..");
  }

  next();
});

exports.checkUpdateContactData = catchAsync(async (req, res, next) => {
  const { error, value } = userValidator.dataValidator(req.body);

  if (error) {
    console.log(error);
    const fieldMissing = error.details[0].context.key;
    error.message = `${fieldMissing} field is required`;
    throw new AppError(400, error.message);
  }

  req.body = value;
  next();
});
