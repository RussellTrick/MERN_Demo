const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Project: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  Urgency: {
    type: String,
    required: true,
  },
  Member: {
    type: String,
    required: true,
  },
});

TicketSchema.save((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("User saved successfully");
  }
});

const TicketModel = mongoose.model("projects", TicketModel);
module.exports = TicketModel;