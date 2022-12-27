const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventName: String,
  description: String,
  performers: Array,
  regularEntryFee: Number,
  vipEntryFee: Number,
  vvipEntryFee: Number,
  image1: String,
  image2: String,
  image3: String,
  locationName: String,
  locationCoordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

exports.Event = mongoose.model("Event", EventSchema);
