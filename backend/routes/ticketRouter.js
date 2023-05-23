const { Router } = require("express");
const router = Router();
const { checkAuth } = require("../middlewares/auth");
const {
  getTicketById,
  deleteTicket,
  createTicket,
  updateTicket,
} = require("../controllers/Tickets");

router.get("/:ticketId", checkAuth, getTicketById);
router.delete("/:ticketId", checkAuth, deleteTicket);
router.post("/", checkAuth, createTicket);
router.put("/:ticketId", checkAuth, updateTicket);

module.exports = router;
