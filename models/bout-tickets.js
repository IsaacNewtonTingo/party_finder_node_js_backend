const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoughtTicketSchema = new Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ticketNumber: String,
    checkedIn: Boolean,
  },
  { timestamps: true }
);

exports.BoughtTicket = mongoose.model("BoughtTicket", BoughtTicketSchema);
