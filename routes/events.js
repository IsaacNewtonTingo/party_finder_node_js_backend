const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getOneEvent,
  joinEvent,
  getEventAttendees,
  optOutOfEvent,
  addEventComment,
  getEventComments,
  deleteEventComment,
} = require("../controller/events");

//Only admin can add these special events
router.post("/create-event", createEvent);
router.get("/get-all-events", getAllEvents);
router.get("/get-one-event/:id", getOneEvent);
router.post("/join-event/", joinEvent);
router.post("/opt-out-of-event/", optOutOfEvent);
router.get("/get-event-attendees/:id", getEventAttendees);
router.post("/add-event-comment", addEventComment);
router.get("/get-event-comments/:id", getEventComments);
router.delete("/delete-event-comments/:id", deleteEventComment);

module.exports = router;
