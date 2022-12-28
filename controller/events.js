const { EventAttendee } = require("../models/event-attendees");
const { Event } = require("../models/events");

exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      eventDate,
      organizer,
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
    } else if (!eventDate) {
      res.json({
        status: "Failed",
        message: "Please add the event date",
      });
    } else if (!organizer) {
      res.json({
        status: "Failed",
        message: "Please add an organizer",
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
        eventDate,
        organizer,
        performers,
        regularEntryFee,
        vipEntryFee,
        vvipEntryFee,
        image1,
        image2,
        image3,
        locationName,
        locationCoordinates,
        active: true,
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

//Join an event
exports.joinEvent = async (req, res) => {
  try {
    const { userID, eventID } = req.body;
    //check if event still exists
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        //check if already joined
        const existingAttendee = await EventAttendee.findOne({
          $and: [{ user: userID }, { event: eventID }],
        });
        if (existingAttendee) {
          res.json({
            status: "Failed",
            message: "You are already going to this event",
          });
        } else {
          const newEventAttendee = new EventAttendee({
            user: userID,
            event: eventID,
          });

          await newEventAttendee.save();
          res.json({
            status: "Success",
            message: "Your attendance is successfully confirmed",
          });
        }
      } else {
        res.json({
          status: "Failed",
          message: "Event has expired",
        });
      }
    } else {
      //event not found
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to join the event",
    });
  }
};

//opt out of event
exports.optOutOfEvent = async (req, res) => {
  try {
    const { userID, eventID } = req.body;
    //check if event still exists
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        //check if already joined
        const existingAttendee = await EventAttendee.findOneAndDelete({
          $and: [{ user: userID }, { event: eventID }],
        });
        if (existingAttendee) {
          res.json({
            status: "Success",
            message: "You have successfully opted out the event",
          });
        } else {
          res.json({
            status: "False",
            message: "You had already opted out of the event",
          });
        }
      } else {
        res.json({
          status: "Failed",
          message: "Event has expired",
        });
      }
    } else {
      //event not found
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to join the event",
    });
  }
};

//get event attendies
exports.getEventAttendees = async (req, res) => {
  try {
    const eventID = req.params.id;
    //check event
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        const eventAttendees = await EventAttendee.find({});
        res.json({
          status: "Success",
          message: "Data found",
          data: eventAttendees,
        });
      } else {
        res.json({
          status: "Failed",
          message: "Event has expired",
        });
      }
    } else {
      //event not found
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to get event attendees",
    });
  }
};
