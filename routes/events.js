const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getOneEvent,
  joinEvent,
  getEventAttendees,
  optOutOfEvent,
} = require("../controller/events");

//Only admin can add these special events
router.post("/create-event", createEvent);
router.get("/get-all-events", getAllEvents);
router.get("/get-one-event/:id", getOneEvent);
router.post("/join-event/", joinEvent);
router.post("/opt-out-of-event/", optOutOfEvent);
router.get("/get-event-attendees/:id", getEventAttendees);

module.exports = router;
