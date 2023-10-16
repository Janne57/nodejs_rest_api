// const nodemailer = require("nodemailer");
const { catchAsync } = require("../utils");
const userService = require("../services/userService");
const { AppError } = require("../utils/index");
const { User } = require("../models/user.models");
const Email = require("../services/emailSevice");

exports.register = catchAsync(async (req, res) => {
  // const emailTransporter = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   }
  // });

  // const emailConfig = {
  //   from: "evgeniyahome1981@gmail.com",
  //   to: user.email,
  //   subject: "Password reset instruction",
  //   text: "Hello, this is the test letter!",
  // };

  // await emailTransporter.sendMail(emailConfig);

  try {
    const { user, token } = await userService.registerUser(req.body);
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/register/${
      user.verificationToken
    }`;

    await new Email(user, resetUrl).sendVerifyEmail();

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
  }
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

// verification of email
exports.verifyEmail = catchAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({
      msg: "User not found..",
    });
  }

  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({ message: "Verification successful" });
});


// resend verification of email
exports.verifyResendEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    return res.status(400).json({ msg: "missing required field email" });
  }

  if (!user) {
    return res.status(404).json({ msg: "User not found.." });
  }

  if (!user.verify) {
    // повторная отправка письма

    try {
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/auth/register/${user.verificationToken}`;
      await new Email(user, resetUrl).sendVerifyEmail();

      return res.status(200).json({ msg: "Verification email sent" });
    } catch (error) {
      console.log(error);
    }
  }

  res.status(400).json({ msg: "Verification has already been passed" });
});
