require("dotenv").config();
const port = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
const http = require("http");
const { initializeDBConnection } = require("./config/db.config");

const app = express();
app.use(express.json());
app.use(cors());

// called before any route
initializeDBConnection();

app.get("/", (req, res) => {
  return res.send({ message: "Welcome" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
