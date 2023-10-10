const { catchAsync } = require("../utils");
const userService = require("../services/userService");
const { AppError } = require("../utils/index");
const { User } = require("../models/user.models");

exports.register = catchAsync(async (req, res) => {
  const { user, token } = await userService.registerUser(req.body);

  res.status(201).json({ user, token });
});

exports.login = catchAsync(async (req, res) => {
  const { user, token } = await userService.loginUser(req.body);

  await User.findOneAndUpdate({ email: user.email }, { token });
  res.status(200).json({
    user,
    token,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const { user } = await userService.logoutUser(req.headers.authorization);
  // const { email } req.user
  if (!user) {
    throw new AppError(401, "Not authorized..");
  }

  await User.findOneAndUpdate({ email: user.email }, { token: null });

  res.status(204).json({
    message: "No content",
  });
});

exports.currentUser = catchAsync(async (req, res) => {
  const { user } = await userService.logoutUser(req.headers.authorization);

  if (!user) {
    throw new AppError(401, "Not authorized..");
  }

  res.status(200).json({
    user,
  });
});
