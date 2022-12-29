const { EventAttendee } = require("../models/event-attendees");
const { EventComment } = require("../models/event-comments");
const { EventLike } = require("../models/event-likes");
const { EventSave } = require("../models/event-save");
const { Event } = require("../models/events");
const User = require("../models/user");

//create event
exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      eventDate,
      userID,
      performers,
      regularEntryFee,
      vipEntryFee,
      vvipEntryFee,
      image1,
      image2,
      image3,
      buildingName,
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
    } else if (!buildingName) {
      res.json({
        status: "Failed",
        message: "Please add the building name",
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
      //check if event is being created by a verified user
      const user = await User.findOne({ _id: userID });
      if (user.verified == true) {
        const newEvent = new Event({
          eventName,
          description,
          eventDate,
          organizer: userID,
          performers,
          regularEntryFee,
          vipEntryFee,
          vvipEntryFee,
          image1,
          image2,
          image3,
          buildingName,
          locationName,
          locationCoordinates,
          active: true,
          verified: true,
          featured: false,
        });

        await newEvent.save().then(() => {
          res.json({
            status: "Success",
            message: "Event created successfully",
          });
        });
      } else {
        const newEvent = new Event({
          eventName,
          description,
          eventDate,
          organizer: userID,
          performers,
          regularEntryFee,
          vipEntryFee,
          vvipEntryFee,
          image1,
          image2,
          image3,
          buildingName,
          locationName,
          locationCoordinates,
          active: false,
          verified: false,
          featured: false,
        });

        await newEvent.save().then(() => {
          res.json({
            status: "Success",
            message: "Event created successfully",
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to create an event",
    });
  }
};

//update an event
exports.editEvent = async (req, res) => {
  try {
    //check if event exists
    const {
      eventName,
      description,
      eventDate,
      userID,
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

    //check if user is verified
    const eventID = req.params.id;
    const event = await Event.findOne({
      $and: [{ organizer: userID }, { _id: eventID }],
    });

    if (event) {
      //event found
      await Event.updateOne(
        { _id: eventID },
        {
          eventName,
          description,
          eventDate,
          performers,
          regularEntryFee,
          vipEntryFee,
          vvipEntryFee,
          image1,
          image2,
          image3,
          locationName,
          locationCoordinates,
        }
      );

      res.json({
        status: "Success",
        message: "Event updated successfully",
      });
    } else {
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to update the event",
    });
  }
};

//delete event
exports.deleteEvent = async (req, res) => {
  //when you delete, delete: Comments,events gooers,likes,saves
};

//Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { lng, lat } = req.query;

    const response = await Event.find({
      locationCoordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
        },
      },
    });

    res.json({
      status: "Success",
      message: "Events retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to get all events",
    });
  }
};

//get one event
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

//get event attendees
exports.getEventAttendees = async (req, res) => {
  try {
    const eventID = req.params.id;
    //check event
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        const eventAttendees = await EventAttendee.find({}).populate(
          "user",
          "firstName lastName profilePicture"
        );
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

//add event comments
exports.addEventComment = async (req, res) => {
  try {
    const { userID, content, eventID } = req.body;

    //check if event is active
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        const newEventComment = new EventComment({
          user: userID,
          event: eventID,
          content,
        });

        await newEventComment.save();
        res.json({
          status: "Success",
          message: "Comment added successfully",
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
      message: "Something went wrong while trying to post your comment",
    });
  }
};

//get event comments
exports.getEventComments = async (req, res) => {
  try {
    const eventID = req.params.id;

    //check if event is active
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //event exists
      if (event.active == true) {
        const eventComments = await EventComment.find({
          event: eventID,
        }).populate("user", "firstName lastName profilePicture");
        res.json({
          status: "Success",
          message: "Events comments found",
          data: eventComments,
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
      message: "Something went wrong while trying to post your comment",
    });
  }
};

//delete comment
exports.deleteEventComment = async (req, res) => {
  try {
    const commentID = req.params.id;
    const { userID } = req.body;
    //check if comment exists first
    const comment = await EventComment.findOne({
      _id: commentID,
    });
    if (comment) {
      if (comment.user != userID) {
        //not authorized
        res.json({
          status: "Failed",
          message: "Anauthorized operation",
        });
      } else {
        //authorized
        await EventComment.findOneAndDelete({ _id: commentID });
        res.json({
          status: "Success",
          message: "Comment deleted successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Comment not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to delete your comment",
    });
  }
};

//search event
exports.searchEvent = async (req, res) => {
  try {
    var { searchTerm } = req.query;
    searchTerm = searchTerm.trim();

    const searchResult = await Event.find({
      $or: [
        { eventName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json({
      status: "Success",
      message: "Search was successfull",
      data: searchResult,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while trying to delete your comment",
    });
  }
};

//event like
exports.likeEventController = async (req, res) => {
  try {
    const eventID = req.params.id;
    const { userID } = req.body;

    //check if event exists
    const event = await Event.findOne({
      _id: eventID,
    });
    if (event) {
      //check if event is already liked
      const likedEvent = await EventLike.findOne({
        $and: [{ user: userID }, { event: eventID }],
      });
      if (likedEvent) {
        //has already liked
        //unlike
        await EventLike.deleteMany({
          $and: [{ user: userID }, { event: eventID }],
        });

        res.json({
          status: "Success",
          message: "Event unliked successfully",
        });
      } else {
        //not liked
        const newEventLike = new EventLike({
          user: userID,
          event: eventID,
        });

        await newEventLike.save();
        res.json({
          status: "Success",
          message: "Event liked successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while liking the event",
    });
  }
};

//get event likes
exports.getEventLikes = async (req, res) => {
  try {
    const eventID = req.params.id;

    //check if event exists
    const event = await Event.findOne({
      _id: eventID,
    });
    if (event) {
      const eventLikes = await EventLike.find({
        event: eventID,
      }).populate("user", "firstName lastName profilePicture");

      res.json({
        status: "Success",
        message: "Event likes retrieved successfully",
        data: eventLikes,
        count: eventLikes.length,
      });
    } else {
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting likes",
    });
  }
};

//save event
exports.saveEventController = async (req, res) => {
  try {
    const eventID = req.params.id;
    const { userID } = req.body;

    //check if event exists
    const event = await Event.findOne({
      _id: eventID,
    });
    if (event) {
      //check if event is already saved
      const savedEvent = await EventSave.findOne({
        $and: [{ user: userID }, { event: eventID }],
      });
      if (savedEvent) {
        //has already saved
        //unsave
        await EventSave.deleteMany({
          $and: [{ user: userID }, { event: eventID }],
        });

        res.json({
          status: "Success",
          message: "Event unsaved successfully",
        });
      } else {
        //not saved
        const newEventSave = new EventSave({
          user: userID,
          event: eventID,
        });

        await newEventSave.save();
        res.json({
          status: "Success",
          message: "Event saved successfully",
        });
      }
    } else {
      res.json({
        status: "Failed",
        message: "Event not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while saving the event",
    });
  }
};

//get my saved events
exports.getSavedEvents = async (req, res) => {
  try {
    const userID = req.params.id;
    const savedEvents = await EventSave.find({
      user: userID,
    });

    res.json({
      status: "Success",
      message: "Saved events retrieved successfully",
      data: savedEvents,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while getting saved events",
    });
  }
};
