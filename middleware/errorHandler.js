const mongoose = require("mongoose");
const accountError = require("../errors/accountError");
const errorHandler = (err, req, res, next) => {
  // console.log("gen", err);
  if (err.code === 11000) {
    return accountError(err, req, res);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    if (err.message.includes("Account validation failed")) {
      return accountError(err, req, res);
    }
  }
  if (err instanceof mongoose.Error) {
    return accountError(err, req, res);
  }
  return res.status(500).json({
    msg: "Something went wrong! Please try after some time",
    status: "Error",
  });
};
module.exports = errorHandler;
