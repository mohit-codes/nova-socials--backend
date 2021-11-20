require("dotenv").config();
const port = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
const { initializeDBConnection } = require("./config/db.config");
const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");
const app = express();
app.use(express.json());
app.use(cors());

// called before any route
initializeDBConnection();

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
  return res.send({ message: "Welcome" });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
