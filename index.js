require("dotenv").config();
const port = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const { initializeDBConnection } = require("./config/db.config");
const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");
const messageRouter = require("./routers/message.router");
const authenticate = require("./middleware/authenticate");
const {
  createMessage,
  startMessage,
} = require("./controllers/message.controller");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, { cors: true });
// called before any route
initializeDBConnection();

app.use("/users", userRouter);
app.use("/posts", authenticate, postRouter);
app.use("/messages", authenticate, messageRouter);

app.get("/", (req, res) => {
  return res.send({ message: "Welcome" });
});

let connectedUsers = new Map();

io.on("connection", (socket) => {
  let { id } = socket.client;

  socket.on("connectUser", ({ name }) => {
    //  When the client sends 'name', we store the 'name',
    //  'socket.client.id', and 'socket.id in a Map structure
    connectedUsers.set(name, [socket.client.id, socket.id]);
    io.emit("onlineUsers", Array.from(connectedUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (let key of connectedUsers.keys()) {
      if (connectedUsers.get(key)[0] === id) {
        connectedUsers.delete(key);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(connectedUsers.keys()));
  });

  socket.on("startMessage", ({ senderId, receiverEmail }) => {
    startMessage(senderId, receiverEmail);
  });

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const { email, name } = receiver;
    let receiverSocketId =
      connectedUsers.get(name) === undefined
        ? false
        : connectedUsers.get(name)[1];
    let senderSocketId = connectedUsers.get(sender.name)[1];
    createMessage(sender._id, email, message).then(
      ({ info, isNewRecipient }) => {
        if (isNewRecipient && receiverSocketId) {
          io.to(receiverSocketId).emit("newRecipient", info.sender);
        } else if (receiverSocketId) {
          io.to(receiverSocketId).emit("message", info);
        }
        io.to(senderSocketId).emit("message", info);
      }
    );
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
