const Project = require("../models/Projects");
const User = require("../models/Users");
const mongoose = require("mongoose");

exports.getProjectsByUserId = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ projects: user.Projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProjectById = async (req, res) => {
  const projectId = req.params.projectId;
  console.log(projectId);
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createProject = async (req, res) => {
  const {
    Title,
    Description,
    TeamLead,
    Created,
    Status,
    Urgency,
    Members,
    Tickets,
  } = req.body;

  try {
    const members = Members.map((memberId) =>
      mongoose.Types.ObjectId(memberId)
    );
    const tickets = Tickets.map((ticketId) =>
      mongoose.Types.ObjectId(ticketId)
    );
    const teamlead = mongoose.Types.ObjectId(TeamLead);

    const project = new Project({
      Title,
      Description,
      TeamLead: teamlead,
      Created,
      Status,
      Urgency,
      Members: members,
      Tickets: tickets,
    });
    await project.save();
    res.status(201).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    return res.status(404).json({ message: "Project ID missing from payload" });
  }

  const {
    Title,
    Description,
    TeamLead,
    Created,
    Status,
    Urgency,
    Members,
    Tickets,
  } = req.body;

  try {
    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (Title) project.Title = Title;
    if (Description) project.Description = Description;
    if (TeamLead) project.TeamLead = TeamLead;
    if (Created) project.Created = Created;
    if (Status) project.Status = Status;
    if (Urgency) project.Urgency = Urgency;
    if (Members) project.Members = Members;
    if (Tickets) project.Tickets = Tickets;
    await project.save();
    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await project.remove();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeTicketFromProject = async (req, res, next) => {
  console.log("Attempting to remove ticket from project");
  try {
    const projectId = req.body.projectId;
    const ticketId = req.body.ticketId;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { Tickets: ticketId } },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addTicketToProject = async (req, res, next) => {
  console.log("Attempting to add a ticket to project");
  try {
    const projectId = req.body.projectId;
    const ticketId = req.body.ticketId;
    if (!ticketId) return "Missing ticket id";
    if (!projectId) return "Missing project id";

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      { $addToSet: { Tickets: ticketId } },
      { new: true }
    );

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
