const mongoose = require("mongoose");
const validator = require("validator");

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
      //? We  can use Regex to validate email or external library like "validator".
      //   match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      //   minLength: 6,
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
      //? By default this validate function will only run on create new doc and not for update method of existing doc. To enable it we use "runValidators" in the findByIdAndUpdate (in third argument i.e., options).
      //   validate(value) {
      //     if (!["Male", "Female", "Others"].includes(value)) {
      //       throw new Error(
      //         "Gender data not valid, choose from either, Male, Female or Others"
      //       );
      //     }
      //   },
      //? We can also use enum instead
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

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
