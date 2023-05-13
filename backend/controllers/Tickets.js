const Ticket = require("../models/Tickets");
const User = require("../models/Users");
const mongoose = require("mongoose");

exports.getTicketsByProjectId = async (req, res) => {
  const ticketId = req.params.id;
  console.log(ticketId);
  try {
    const ticket = await Ticket.findOne({ Project: ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({
      ticket: {
        _id: ticket?._id,
        Name: ticket?.Name,
        Description: ticket?.Description,
        Project: ticket?.Project,
        Status: ticket?.Status,
        Urgency: ticket?.Urgency,
        Member: ticket?.Member,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
