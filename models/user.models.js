const { model, Schema } = require("mongoose");
const { compare, genSalt, hash } = require("bcrypt");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});


userSchema.methods.checkPassword = (candidate, passwordHash) => compare(candidate, passwordHash);

const User = model("users", userSchema);

module.exports = {
  User,
};
