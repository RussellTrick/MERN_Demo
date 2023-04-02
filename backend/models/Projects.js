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
    type: String,
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
    type: Array,
    required: true,
    default: [],
  },
  Tickets: {
    type: Array,
    required: true,
    default: [],
  },
});

const ProjectModel = mongoose.model("projects", ProjectSchema);
module.exports = ProjectModel;
