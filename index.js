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
const UserRouter = require("./routes/users/user");
const EventRouter = require("./routes/events/events");
const TicketRoute = require("./routes/tickets/tickets");
const PostRouter = require("./routes/posts/post");

app.use("/api/user", UserRouter);
app.use("/api/event", EventRouter);
app.use("/api/ticket", TicketRoute);
app.use("/api/post", PostRouter);
