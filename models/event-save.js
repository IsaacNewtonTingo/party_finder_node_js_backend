const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSaveSchema = new Schema(
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

exports.EventSave = mongoose.model("EventSave", EventSaveSchema);
