const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password should have: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default description of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

//? Another way of generating JWT token, instead of doing it in /login. Never use arrow function here as we are using "this" keyword.
userSchema.methods.getJWT = async function () {
  // Extracting user from this object.
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Super@Secret", {
    expiresIn: "1d",
  });
  return token;
};

//! The below are some Schema Methods.

//? Another way of comparing password put by user with actual password stored in db using bcrypt, instead of doing it in /login. We are getting passwordInputByUser from the req body of /login.
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  //? Both are same
  // const passwordHash = this.password;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
