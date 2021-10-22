const mongoose = require("mongoose");
require("dotenv").config();

function initializeDBConnection() {
  mongoose
    .connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("successfully connected"))
    .catch((error) => console.error("mongoose connection failed...", error));
}

module.exports = { initializeDBConnection };
