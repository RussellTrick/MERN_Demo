const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connection = require("./db");
require("dotenv").config();

//datbase connection
connection();

const cors = require("cors");
const userRouter = require("./routes/Router");

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use("/api/v1/users/", userRouter);

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
