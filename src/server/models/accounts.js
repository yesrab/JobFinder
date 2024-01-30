const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AccountSchema = new mongoose.Schema({
  picture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
  },
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
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v.toString());
      },
      message: "Enter a valid 10-digit phone number",
    },
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

//mongoose static method to login
AccountSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new mongoose.Error(
      JSON.stringify({ path: "password", msg: "Incorrect email/password" })
    );
  }
  throw new mongoose.Error(
    JSON.stringify({ path: "email", msg: "Incorrect email/password" })
  );
};

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
