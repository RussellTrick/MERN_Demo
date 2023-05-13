const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Project: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const TicketModel = mongoose.model("Ticket", TicketSchema, "Ticket");
module.exports = TicketModel;
