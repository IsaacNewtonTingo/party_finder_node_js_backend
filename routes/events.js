const express = require("express");
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getOneEvent,
} = require("../controller/events");

//Only admin can add these special events
router.post("/create-event", createEvent);
router.get("/get-all-events", getAllEvents);
router.get("/get-one-event/:id", getOneEvent);

module.exports = router;
