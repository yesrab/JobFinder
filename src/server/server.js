const express = require("express");
require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());

//import db connections
const connectDB = require("./db/connect");

//express middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//custom middleware

const errorHandler = require("./middleware/errorHandler");

//health check
app.get("/ping", (req, res) => {
  const startTime = new Date();

  res.status(200).json({
    msg: "pong",
    status: "Active",
    time: startTime,
  });
});

//import router
const accoutsRoute = require("./routes/account");
const jobsRoute = require("./routes/jobs");
//use router

app.use("/api/v1/user/", accoutsRoute);
app.use("/api/v1/job/", jobsRoute);
//error handler at last
app.use(errorHandler);
const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.DB);
    console.log("Connected to DataBase");
    app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
