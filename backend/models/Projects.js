const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  TeamLead: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Created: {
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
  Members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Member",
    required: true,
    default: [],
  },
  Tickets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Ticket",
    required: true,
    default: [],
  },
});

const ProjectModel = mongoose.model("Project", ProjectSchema);
module.exports = ProjectModel;
