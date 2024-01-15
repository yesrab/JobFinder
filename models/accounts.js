const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  password: {
    type: String,
    required: [true, "Please set a valid password"],
  },
});
//encrypt passwords before saving them

AccountSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
