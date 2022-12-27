const { Event } = require("../models/events");
const { Ticket } = require("../models/tickets");

const { v4: uuidv4 } = require("uuid");
const request = require("request");

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

//buy a ticket
exports.buyEventTicket = async (req, res) => {
  try {
    const eventTicketID = req.params.id;
    let { phoneNumber, userID } = req.body;
    const accountNumber = uuidv4() + userID;

    const ticket = await Ticket.findOne({ _id: eventTicketID }).populate(
      "event"
    );

    if (ticket.event.active === true) {
      //make payment via mpesa
      const amount = ticket.ticketPrice;
      const body = `amount=${amount}&msisdn=${parseInt(
        phoneNumber
      )}&account_no=${accountNumber}`;

      request(
        {
          url: "https://tinypesa.com/api/v1/express/initialize",
          method: "POST",
          headers: {
            Apikey: process.env.APE_30_TINY_PESA_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            const sendRes = JSON.parse(body);

            if (sendRes.success === true) {
              //check payment
              let paymentStatus = 0;
              const interval = setInterval(() => {
                console.log("---------Checking payment---------");
                request(
                  {
                    url: `https://tinypesa.com/api/v1/express/get_status/${accountNumber}`,
                    method: "GET",
                    headers: {
                      Apikey: process.env.APE_30_TINY_PESA_API_KEY,
                      Accept: "application/json",
                    },
                  },
                  function (error, response, body) {
                    if (error) {
                      console.log(error);
                    } else {
                      const newBody = JSON.parse(body);
                      paymentStatus = newBody.is_complete;
                      if (newBody.is_complete === 1) {
                        clearInterval(interval);
                        clearTimeout(timeOut);

                        res.json({
                          status: "Success",
                          message: "Payment made successfully",
                        });
                      }
                    }
                  }
                );
              }, 1000);

              const timeOut = setTimeout(() => {
                clearInterval(interval);

                res.json({
                  status: "Failed",
                  message:
                    "You did not complete the payment process. Please make sure you are next to your phone and make the payment",
                });
              }, 120000);
            } else {
              res.json({
                status: "Error",
                ResponseDescription: "An error occured. Please try again later",
              });
            }
          }
        }
      );
    } else {
      res.json({
        status: "Failed",
        message: "Event has expired",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "Failed",
      message: "Something went wrong while buying the ticket",
    });
  }
};
