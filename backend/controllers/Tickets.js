const Ticket = require("../models/Tickets");
const User = require("../models/Users");
const mongoose = require("mongoose");

exports.getTicketById = async (req, res) => {
  const ticketId = req.params.ticketId;
  console.log(ticketId);
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTicket = async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    await ticket.remove();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createTicket = async (req, res) => {
  const { Name, Description, Project, Status, Urgency } = req.body;

  const Member = req.user._id;

  try {
    const ticket = new Ticket({
      Name,
      Description,
      Project,
      Status,
      Urgency,
      Member,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTicket = async (req, res) => {
  const ticketId = req.params.ticketId;
  const Member = req.user._id;
  if (!Member) {
    return res.status(404).json({ message: "Member ID missing, please relog" });
  }
  if (!ticketId) {
    return res.status(404).json({ message: "Ticket ID missing from payload" });
  }

  const { Name, Description, Urgency, Status, Project } = req.body;

  try {
    let ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (Name) ticket.Name = Name;
    if (Description) ticket.Description = Description;
    if (Status) ticket.Status = Status;
    if (Urgency) ticket.Urgency = Urgency;
    if (Member) ticket.Member = Member;
    if (Project) ticket.Project = Project;
    await ticket.save();
    res.status(200).json({ ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
