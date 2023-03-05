const express = require("express");
const {
  createTicket,
  getTicketVariants,
  buyEventTicket,
} = require("../../controller/tickets/tickets");
const router = express.Router();

//Only admin can add these tickets
router.post("/create-ticket", createTicket);

//Users
router.get("/get-event-tickets/:id", getTicketVariants);
router.post("/buy-event-ticket/:id", buyEventTicket);

module.exports = router;
