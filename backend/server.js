require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connection = require("./db");
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 8000;
const domainOrigin = process.env.DOMAIN_ORIGIN;
//database connection
connection();

const cors = require("cors");
const userRouter = require("./routes/Router");
const projectRouter = require("./routes/projectRouter");
const ticketRouter = require("./routes/ticketRouter");

app.use(express.static("frontend/build"));
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tickets", ticketRouter);

app.listen(PORT, () => {
  console.log("listening on port:" + PORT + "~ Domain origin: " + domainOrigin);
});
