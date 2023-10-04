const Joi = require("joi");

exports.dataValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(2).max(28).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(). required(),
    })
    .validate(data);


    exports.registerValidator = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      // name: Joi.string().min(2).max(28).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // password: Joi.string().regex(regex.PASSWORD_REGEX).required(),
    })
    .validate(data);