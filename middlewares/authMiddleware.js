const { AppError, catchAsync, userValidator } = require("../utils/index");
const { checkUserExists } = require("../services/userService");
const { User } = require("../models/user.models");
const { checkToken } = require("../services/jwtService");
const passport = require("passport");
// const JWTStrategy = require("passport-jwt").Strategy;


exports.chekRegisterUser = catchAsync(async (req, res, next) => {
  const { error, value } = userValidator.registerValidator(req.body);

  if (error) {
    console.log(error);
    throw new AppError(400, "Invalid user data...");
  }

  await checkUserExists({ email: value.email });
  req.body = value;

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new AppError(401, "Not authorized...");
  }

  req.user = currentUser;
  next();
});


exports.auth = catchAsync(async(req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user) => {
        if (!user || err) {
          return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Unauthorized rrr',
            data: 'Unauthorized rrr',
          })
        }
        req.user = user
        next()
      })(req, res, next)
    });
  

// exports.authJwt = catchAsync(async(req, res, next) => {
//   const authJwt = require("express-jwt").unless({
//     path: ["/users/login", "/users/register"],
//     secret: process.env.JWT_SECRET,
//   });

// })