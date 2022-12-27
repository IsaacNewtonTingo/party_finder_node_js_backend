const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser").json;

const app = express();
app.use(cors());
app.use(bodyParser());

require("dotenv").config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

require("./config/db");
const UserRouter = require("./routes/user");
const EventRouter = require("./routes/events");
const TicketRoute = require("./routes/tickets");

app.use("/api/user", UserRouter);
app.use("/api/event", EventRouter);
app.use("/api/ticket", TicketRoute);
