const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    phoneNumber: Number,
    profilePicture: String,
    password: String,
    verified: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
