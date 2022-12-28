const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventCommentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    content: String,
  },
  { timestamps: true }
);

exports.EventComment = mongoose.model("EventComment", EventCommentSchema);
