const jobData = require("../models/jobs");
const axios = require("axios");
const cache = require("memory-cache");
const fetch = require("node-fetch");
const apikey = process.env.GEOAPI || null;
const addJobs = async (req, res) => {
  const {
    companyName,
    logoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    jobLocation,
    jobCity,
    jobDescription,
    aboutCompany,
    skills,
    information,
    createdBy,
    companySize,
  } = req.body;
  const job = await jobData.create({
    companyName,
    logoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    jobLocation,
    jobCity,
    jobDescription,
    aboutCompany,
    skills,
    information,
    createdBy,
    companySize,
  });
  const token = res.locals.tokenData;
  // console.log("in addjob controller", token);
  res.status(200).json(job);
  cache.del("data");
};

const getAllJobs = async (req, res) => {
  const { reqId, skills, position } = req.query || null;
  const skillsArray = skills ? skills.split(",") : [];
  // console.log(position);

  const data = cache.get("data");
  if (data) {
    // console.log("Serving from cache alljobs");
    return res.status(304).json(data);
  }

  const find = {};
  if (skillsArray.length > 0) {
    find.skills = { $in: skillsArray };
  }
  if (position) {
    find.jobPosition = {
      $regex: position,
      $options: "i",
    };
  }

  const skillsPipeline = [
    {
      $unwind: {
        path: "$skills",
      },
    },
    {
      $group: {
        _id: null,
        allSkills: {
          $addToSet: "$skills",
        },
      },
    },
    {
      $project: {
        _id: 0,
        allSkills: 1,
      },
    },
  ];

  const allSkillsOutput = await jobData.aggregate(skillsPipeline);
  const allSkills = allSkillsOutput[0]?.allSkills || [];

  const jobs = await jobData
    .find(find)
    .select(
      "_id companyName logoUrl jobPosition monthlySalary jobType jobLocation jobCity skills companySize createdBy"
    );

  const updatedJobs = await Promise.all(
    jobs.map(async (job) => {
      const mutable = reqId === job.createdBy.toString();

      // Get geolocation data
      const geolocationurl = `https://api.opencagedata.com/geocode/v1/json?key=${apikey}&q=${encodeURIComponent(
        job.jobCity
      )}`;
      const geolocationResponse = await fetch(geolocationurl);
      const geolocationData = await geolocationResponse.json();
      const country_code =
        geolocationData.results[0]?.components?.country_code || "";
      const country = geolocationData.results[0]?.components?.country || "";

      // Get flag URL
      let flagurl = `https://flagsapi.com/${
        country_code.toUpperCase() || "IN"
      }/flat/32.png`;

      if (res.statusCode === 402) {
        // Use Indian flag as default for status 402
        flagurl = "https://flagsapi.com/IN/flat/32.png";
      } else {
        flagurl = `https://flagsapi.com/${
          country_code.toUpperCase() || "IN"
        }/flat/32.png`;
      }

      const updatedJob = {
        ...job.toObject(),
        mutable,
        flagurl,
        country,
      };
      delete updatedJob.createdBy;

      return updatedJob;
    })
  );

  cache.put("data", { allSkills, updatedJobs, nbHits: jobs.length }, 1000 * 2);
  res.status(200).json({ allSkills, updatedJobs, nbHits: jobs.length });
};

const getJob = async (req, res) => {
  const { reqId } = req.query || null;
  const jobId = req.params.jobId;
  const data = cache.get("data");
  if (data) {
    // console.log("Serving from cache");
    return res.status(304).json(data);
  }
  const job = await jobData.findById(jobId);

  if (!job) {
    return res.status(404).json({ msg: "Job not found", status: "Error" });
  }

  // console.log("created by", job.createdBy.toString());
  // console.log("reqid", reqId);
  const geolocationurl = `https://api.opencagedata.com/geocode/v1/json?key=${apikey}&q=${encodeURIComponent(
    job.jobCity
  )}`;
  const geolocationResponse = await fetch(geolocationurl);
  const geolocationData = await geolocationResponse.json();
  const country = geolocationData.results[0]?.components?.country || "";
  const updatedJob = { ...job.toObject() };
  updatedJob.country = country;
  if (updatedJob.createdBy.toString() === reqId) {
    updatedJob.mutable = true;
  } else {
    updatedJob.mutable = false;
  }

  cache.put("data", updatedJob, 1000 * 2);
  res.status(200).json(updatedJob);
};

const editJob = async (req, res) => {
  // console.log("entered update jobs");
  const { jobId } = res.locals.reqJob;
  // console.log(res.locals);
  // console.log(jobId);
  const {
    companyName,
    logoUrl,
    jobPosition,
    monthlySalary,
    jobType,
    jobLocation,
    jobCity,
    jobDescription,
    aboutCompany,
    skills,
    information,
    companySize,
  } = req.body;

  const loggedInUserId = res.locals.tokenData.id;

  if (!jobId) {
    return res
      .status(404)
      .json({ msg: "No request id found", status: "Error" });
  }
  // Find the existing job by ID
  const existingJob = await jobData.findById(jobId);

  if (!existingJob) {
    return res.status(404).json({ msg: "Job not found", status: "Error" });
  }

  // Check if the logged-in user is the creator of the job
  if (existingJob.createdBy.toString() !== loggedInUserId) {
    return res.status(403).json({ msg: "Unauthorized", status: "Error" });
  }

  // Update the job properties with the new values
  existingJob.companyName = companyName;
  existingJob.logoUrl = logoUrl;
  existingJob.jobPosition = jobPosition;
  existingJob.monthlySalary = monthlySalary;
  existingJob.jobType = jobType;
  existingJob.jobLocation = jobLocation;
  existingJob.jobCity = jobCity;
  existingJob.jobDescription = jobDescription;
  existingJob.aboutCompany = aboutCompany;
  existingJob.skills = skills;
  existingJob.information = information;
  existingJob.companySize = companySize;

  // Save the updated job
  const updatedJob = await existingJob.save();
  // console.log("updated job", updatedJob);
  // Return the updated job in the response
  return res.status(202).json(updatedJob);
};

module.exports = { addJobs, getAllJobs, getJob, editJob };

