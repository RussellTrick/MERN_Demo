const { Router } = require("express");
const router = Router();
const { checkAuth } = require("../middlewares/auth");
const { getTicketsByProjectId } = require("../controllers/Tickets");

router.get("/:id", checkAuth, getTicketsByProjectId);

module.exports = router;
