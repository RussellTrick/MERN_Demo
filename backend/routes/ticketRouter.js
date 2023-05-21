const { Router } = require("express");
const router = Router();
const { checkAuth } = require("../middlewares/auth");
const { getTicketById, deleteTicket } = require("../controllers/Tickets");

router.get("/:ticketId", checkAuth, getTicketById);
router.delete("/:ticketId", checkAuth, deleteTicket);

module.exports = router;
