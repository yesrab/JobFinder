const mongoose = require("mongoose");
const job = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please enter company name"],
    },
    logoUrl: {
      type: String,
      default: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg",
    },
    jobPosition: {
      type: String,
      required: [true, "Please enter the job position"],
    },
    monthlySalary: {
      type: Number,
      required: [true, "Please enter salary"],
    },
    jobType: {
      type: String,
      required: [true, "Please select the job Type"],
      enum: {
        values: ["Full time", "Part time", "Internship"],
        message: "{VALUE} is not supported",
      },
    },
    jobLocation: {
      type: String,
      required: [true, "Please select the job location"],
      enum: {
        values: ["Remote", "Office"],
        message: "{VALUE} is not supported",
      },
    },
    jobCity: {
      type: String,
      required: [true, "Please enter job posting location"],
    },
    jobDescription: {
      type: String,
      default: "sample job description",
    },
    aboutCompany: {
      type: String,
      default: "Google Inc",
    },
    skills: {
      type: [String],
      required: [true, "please enter atleast one skill"],
    },
    information: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    companySize: {
      type: String,
      default: "11-15",
    },
  },
  { timestamps: true }
);

jobData = mongoose.model("jobData", job);
module.exports = jobData;

