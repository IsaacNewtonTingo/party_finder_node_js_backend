const { Event } = require("../models/events");
const { Ticket } = require("../models/tickets");

exports.createTicket = async (req, res) => {
  try {
    const { event, ticketType, ticketPrice, numberOfTickets } = req.body;

    if (!event) {
      res.json({
        status: "Failed",
        message: "Please enter the event",
      });
    } else if (!ticketType) {
      res.json({
        status: "Failed",
        message: "Please select the ticket type",
      });
    } else if (!ticketPrice) {
      res.json({
        status: "Failed",
        message: "Please enter the ticket price",
      });
    } else if (!numberOfTickets) {
      res.json({
        status: "Failed",
        message: "Please enter the number of tickets",
      });
    } else {
      //check if event exists
      const eventCheck = await Event.findOne({ _id: event });
      if (eventCheck) {
        if (eventCheck.active === true) {
          const newTicket = new Ticket({
            event,
            ticketType,
            ticketPrice,
            numberOfTickets,
          });
          await newTicket.save().then(() => {
            res.json({
              status: "Success",
              message: "Ticket added successfully",
            });
          });
        } else {
          res.json({
            status: "Failed",
            message: "Event has expired",
          });
        }
      } else {
        res.json({
          status: "Failed",
          message: "Event not found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "An error occured while trying to create tickets",
    });
  }
};

//get ticket variants for an event
exports.getTicketVariants = async (req, res) => {
  try {
    const eventID = req.params.id;
    //check if event is available and active
    const event = await Event.findOne({ _id: eventID });
    if (event) {
      //check if event is active
      if (event.active === true) {
        await Ticket.find({ event: eventID }).then((response) => {
          res.json({
            status: "Success",
            message: "Tickets found successfully",
            data: response,
          });
        });
      } else {
        res.json({
          status: "Failed",
          message: "Event has expired",
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
      message: "Something went wrong while getting event tickets",
    });
  }
};
