const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = express();

//import db connections
const connectDB = require("./db/connect");

app.get("/ping", (req, res) => {
  const startTime = new Date();

  res.status(200).json({
    msg: "pong",
    time: startTime,
  });
});

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
