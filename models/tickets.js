const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  ticketType: String,
  ticketPrice: Number,
  numberOfTickets: Number,
});

exports.Ticket = mongoose.model("Ticket", TicketSchema);
