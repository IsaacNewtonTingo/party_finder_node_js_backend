const { Event } = require("../models/events");

exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      performers,
      regularEntryFee,
      vipEntryFee,
      vvipEntryFee,
      image1,
      image2,
      image3,
      locationName,
      locationCoordinates,
    } = req.body;

    if (!eventName) {
      res.json({
        status: "Failed",
        message: "Event name is required",
      });
    } else if (!description) {
      res.json({
        status: "Failed",
        message: "Please add a description",
      });
    } else if (!regularEntryFee) {
      res.json({
        status: "Failed",
        message: "Please add a regular entry fee",
      });
    } else if (!vipEntryFee) {
      res.json({
        status: "Failed",
        message: "Please add a vip entry fee",
      });
    } else if (!vvipEntryFee) {
      res.json({
        status: "Failed",
        message: "Please add a vvip entry fee",
      });
    } else if (!image1 || !image2 || !image3) {
      res.json({
        status: "Failed",
        message: "Please add 3 images",
      });
    } else if (!locationName) {
      res.json({
        status: "Failed",
        message: "Please add a location name",
      });
    } else if (!locationCoordinates) {
      res.json({
        status: "Failed",
        message: "Please add actual location coordinates",
      });
    } else {
      const newEvent = new Event({
        eventName,
        description,
        performers,
        regularEntryFee,
        vipEntryFee,
        vvipEntryFee,
        image1,
        image2,
        image3,
        locationName,
        locationCoordinates,
      });

      await newEvent.save().then(() => {
        res.json({
          status: "Success",
          message: "Event created successfully",
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to create an event",
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    await Event.find({}).then((response) => {
      res.send(response);
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to get all events",
    });
  }
};

exports.getOneEvent = async (req, res) => {
  try {
    const eventID = req.params.id;
    await Event.findOne({ _id: eventID }).then((response) => {
      if (response) {
        res.send(response);
      } else {
        res.json({
          status: "Failed",
          message: "Event not found",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to get the event details",
    });
  }
};
