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
  // console.log("this is register acc body", req.body);
  const data = await Account.create({ name, email, mobile, password });
  res.json({ data, status: "success" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.login(email, password);
  const { _id, name, mobile, email: resEmail } = user;
  const id = _id.toString();
  const token = createToken({ id, name, mobile, email: resEmail });
  res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 });
  // console.log("login information sent", token);
  res
    .status(202)
    .json({ id, mobile, name, email: resEmail, token, status: "success" });
};

module.exports = { registerAccount, login };
