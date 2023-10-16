const { Types } = require("mongoose");
const { User } = require("../models/user.models");
const { AppError } = require("../utils/index");
const { signToken } = require("../services/jwtService");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

exports.checkUserExistById = async (id) => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) {
    throw new AppError(404, "User not found..");
  }

  const userExist = await User.exists({ _id: id });

  if (!userExist) {
    throw new AppError(404, "User not found..");
  }
};

exports.checkUserExists = async (filter) => {
  // const idIsValid = Types.ObjectId.isValid(id);

  // if (!idIsValid) {
  //   throw new AppError(404, "User not found..");
  // }

  const userExist = await User.exists(filter);

  if (userExist) {
    throw new AppError(409, "Email in use...");
  }
};

exports.registerUser = async (userData) => {
  const verificationToken = nanoid();

  const newUserData = {
    ...userData,
    verificationToken,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);
  // const token = jwt.sign(newUser.id, process.env.JWT_SECRET, {
  //   expiresIn: "10h",
  // });

  newUser.token= token;
  return { user: newUser, token };
};

exports.loginUser = async (userData) => {
  const user = await User.findOne({ email: userData.email }).select(
    "+password"
  );

  if (!user) {
    throw new AppError(401, "Not authorized");
  }

  if (!user.verify) {
    throw new AppError(401, "Not verification of email");
  }

  const passwordIsValid = await user.checkPassword(
    userData.password,
    user.password
  );

  if (!passwordIsValid) {
    throw new AppError(401, "Not authorized");
  }

  user.password = undefined;
  const token = signToken(user.id);

  return { user, token };
};

exports.logoutUser = async (auth) => {
  const [bearer, token] = auth.split(" ");
  const verify = jwt.verify(token, process.env.JWT_SECRET);

  const _id = verify.id;

  if (bearer !== "Bearer" || !token) {
    throw new AppError(401, "Not authorized..");
  }

  const user = await User.findById(_id);

  if (!user) {
    throw new AppError(401, "Not authorized..");
  }

  user.token = null;
  user.password = null;
  return { user };
};
