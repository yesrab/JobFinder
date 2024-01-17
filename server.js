const express = require("express");
require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;

const app = express();

//import db connections
const connectDB = require("./db/connect");

//express middlewares

app.use(express.json());
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

//use router

app.use("/api/user/", accoutsRoute);

//error handler at last
app.use(errorHandler);
const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.DB);
    app.listen(PORT, () => console.log(`Server is listening port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
