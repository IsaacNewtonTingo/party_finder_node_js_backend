const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    eventName: String,
    description: String,
    eventDate: Date,
    organizer: String,
    performers: Array,
    regularEntryFee: Number,
    vipEntryFee: Number,
    vvipEntryFee: Number,
    // groupRegularEntryFee: Number,
    // groupVipEntryFee: Number,
    // groupVvipEntryFee: Number,
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
    active: false,
  },
  { timestamps: true }
);
// EventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

exports.Event = mongoose.model("Event", EventSchema);
