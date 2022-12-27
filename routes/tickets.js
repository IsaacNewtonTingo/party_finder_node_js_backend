const express = require("express");
const router = express.Router();

const { createTicket, getTicketVariants } = require("../controller/tickets");

//Only admin can add these tickets
router.post("/create-ticket", createTicket);
router.get("/get-event-tickets/:id", getTicketVariants);

module.exports = router;
