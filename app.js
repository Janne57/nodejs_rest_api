const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/api/authRouter");
const contactsRouter = require("./routes/api/contacts");


const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// // use to have access to json in req body
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
 

// ROUTES
app.use('/api/users', authRouter);
app.use('/api/contacts', contactsRouter);


app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Not found error handler
app.all("*", (req, res) => {
  res.status(404).json({ msg: "Resourse Not found...." });
});

// Global error handler. 4 args required!!!!!
app.use((err, req, res, next) => {
  console.log("||==== ERRORRR =>>>>>>>>>>>");
  console.log(err);
  console.log("<<<<<<<<<<<=============||");

  res.status(500).json({ message: err.message });
});

module.exports = app;
