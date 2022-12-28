const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventAttendeeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  { timestamps: true }
);

exports.EventAttendee = mongoose.model("EventAttendee", EventAttendeeSchema);
