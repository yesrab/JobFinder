const mongoose = require("mongoose");
const JobData = require("./models/jobs"); // Update the path
require("dotenv").config();
const url = process.env.DB;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const accountId = "65aacff282a3edcf52caee5b"; // Replace with your actual Account ID

const jobsData = [
  {
    companyName: "Company A",
    logoUrl: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg",
    jobPosition: "Software Developer",
    monthlySalary: 5000,
    jobType: "Full time",
    jobLocation: "Remote",
    jobCity: "City A",
    jobDescription: "This is a software developer job description.",
    aboutCompany: "Company A is a leading tech company.",
    skills: ["JavaScript", "React", "Node.js"],
    information: "Additional information about the job.",
    createdBy: accountId,
  },
  {
    companyName: "Company B",
    logoUrl: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg",
    jobPosition: "Web Designer",
    monthlySalary: 4000,
    jobType: "Part time",
    jobLocation: "Office",
    jobCity: "City B",
    jobDescription: "This is a web designer job description.",
    aboutCompany: "Company B is a creative design studio.",
    skills: ["HTML", "CSS", "Photoshop"],
    information: "Additional information about the job.",
    createdBy: accountId,
  },

  {
    companyName: "Company C",
    logoUrl: "https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg",
    jobPosition: "Software Developer",
    monthlySalary: 65000,
    jobType: "Full time",
    jobLocation: "Office",
    jobCity: "City A",
    jobDescription: "This is a software developer job description.",
    aboutCompany: "Company A is a leading tech company.",
    skills: ["HTML", "React", "bot", "Node.js"],
    information: "Additional information about the job.",
    createdBy: "65b0ebd518b372825a497a1c",
    companySize: "11-15",
  },
  // Add more dummy data as needed
];

async function populateDatabase() {
  try {
    // Clear existing data
    await JobData.deleteMany({});
    console.log("Cleared existing data.");

    // Populate with new data
    const insertedData = await JobData.insertMany(jobsData);
    console.log("Data inserted successfully:", insertedData);
  } catch (error) {
    console.error("Error populating data:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

populateDatabase();
