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
    type: Date,
    required: true,
    default: Date.now,
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
    ref: "Members",
    required: true,
    default: [],
  },
  Tickets: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tickets",
    required: true,
    default: [],
  },
});

const ProjectModel = mongoose.model("Project", ProjectSchema, "Project");
module.exports = ProjectModel;
