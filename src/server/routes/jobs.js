const express = require("express");
const router = express.Router();
const {
  addJobs,
  getAllJobs,
  getJob,
  getJobSkills,
  editJob,
} = require("../controllers/jobs");
const { requireAuth } = require("../middleware/authMiddleware");
router.route("/addjobs").post(requireAuth, addJobs).put(requireAuth, editJob);
router.route("/getJobs").get(getAllJobs);
router.route("/:jobId").get(getJob);
module.exports = router;
