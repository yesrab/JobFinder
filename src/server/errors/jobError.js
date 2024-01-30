const mongoose = require("mongoose");
const jobError = (err, req, res, next) => {
  // console.log("inside job Error handler");

  const error = {
    companyName: "",
    logoUrl: "",
    jobPosition: "",
    monthlySalary: "",
    jobType: "",
    jobLocation: "",
    jobCity: "",
    jobDescription: "",
    aboutCompany: "",
    skills: "",
    information: "",
    createdBy: "",
    companySize: "",
  };
  if (err.code === 11000) {
    error.email = "This Email account already exists";
    return res.status(400).json(error);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
    return res.status(400).json(error);
  }
  if (err instanceof mongoose.Error) {
    if (JSON.parse(err.message).msg.includes("Incorrect")) {
      const errobj = JSON.parse(err.message);
      error[errobj.path] = errobj.msg;
      // console.log(error);
      return res.status(401).json(error);
    }
  }
  return res.status(500).json({
    msg: "Something went wrong! Please try after some time",
    status: "Error",
  });
};
module.exports = jobError;
