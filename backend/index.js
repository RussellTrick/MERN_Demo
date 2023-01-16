const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const userRouter = require("./routes/Users");

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use("/api/v1/users/", userRouter);

mongoose.connect(process.env.dbConnect);

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
