const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventLikeSchema = new Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

exports.EventLike = mongoose.model("EventLike", EventLikeSchema);
