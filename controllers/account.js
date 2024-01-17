//import db modal
const Account = require("../models/accounts");

//import jwt libs
const jwt = require("jsonwebtoken");
const secrete = process.env.JWT_SUPER_SEACRETE || "superGupthKey";
//token creation function
const maxAge = 1 * 24 * 60 * 60;
const createToken = (obj) => {
  return jwt.sign(obj, secrete, { expiresIn: maxAge });
};

const registerAccount = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  // throw new Error("test");
  // if (!name || !email || !mobile || !password) {
  //   return res
  //     .status(400)
  //     .json({ msg: "please fill in all the details", status: "Error" });
  // }
  const data = await Account.create({ name, email, mobile, password });
  res.json({ data });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.login(email, password);
  const { _id, name, mobile, email: resEmail } = user;
  const id = _id.toString();
  const token = createToken({ id, name, mobile, email: resEmail });
  res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
  res.status(201).json({ mobile, name, email: resEmail, token });
};

module.exports = { registerAccount, login };
