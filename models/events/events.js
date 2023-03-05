const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    eventName: String,
    description: String,
    eventDate: Date,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    performers: Array,
    free: {
      type: Boolean,
      default: true,
    },
    regularEntryFee: Number,
    vipEntryFee: Number,
    vvipEntryFee: Number,
    // groupRegularEntryFee: Number,
    // groupVipEntryFee: Number,
    // groupVvipEntryFee: Number,
    image1: String,
    image2: String,
    image3: String,
    buildingName: String,
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
    active: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
EventSchema.index({ locationCoordinates: "2dsphere" });

exports.Event = mongoose.model("Event", EventSchema);
