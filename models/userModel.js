const mongoose = require("mongoose");
const validator = require("validator");

let userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required."] },
    email: {
      type: String,
      required: [true, "email is required."],
      validate: (val) => {
        return validator.isEmail(val);
      },
    },
    password: { type: String, required: [true, "password is required."] },
    role: { type: String, default : "employee" },
    isActivated: { type: Boolean, default: true },
    createdAt : { type : Date, default : Date.now },
  },
  {
    versionKey: false,
    collection: "users",
  }
);

let userModel = mongoose.model("users", userSchema);

module.exports = { userModel };
