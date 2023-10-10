const app = require("./app");

const mongoose = require("mongoose");
require("dotenv").config();
// const router = require("./routes/api/contacts");
// const router = require("./routes/api/authRouter");

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const port = process.env.port;
// app.use(router);

// MONGODB CONNECTION
mongoose
  .connect(CONNECTION_STRING)
  // .connect( 'mongodb://localhost:27017/')

  .then((con) => {
    console.log("Mongo DB successfully connected..");
    // SERVER
    app.listen(port, () => {
      console.log(`Server running. Use our API on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
