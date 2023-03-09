require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connection = require("./db");
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 8000;
//database connection
connection();

const cors = require("cors");
const userRouter = require("./routes/Router");

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
