const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("Please enter firstName");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should have: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateForgotPassword = (req) => {
  const { emailId, newPassword } = req.body;

  if (!emailId || !newPassword) {
    throw new Error("Email and new password are required");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } 

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "Password should have: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
    );
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateForgotPassword,
};
