const express = require("express");
const http = require("http");
const app = express();
const data = require("./topics.json");
const server = http.createServer(app);
const { randomUUID } = require("crypto");
const fs = require("fs");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("new topics", (msg) => {
    console.log(msg);
    io.emit("new topics", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 3001;

app.get("/topics", async (req, res) => {
  // returning all topics

  //   fs.writeFile("data.json", JSON.stringify(newData), (err) => {
  //     if (err) throw err;
  //     console.log("done writing....");
  //   });

  res.send(data);
});

app.get("/topics/:topicId", async (req, res) => {
  // returning all topics messages
  const topicsArray = [...data];
  const topic = topicsArray.find((topic) => topic.id === req.params.topicId);
  res.send(topic);
});
app.post("/topics/:topicId/:message", async (req, res) => {
  const { message, topicId } = req.params;
  const topicsArray = [...data];
  const topic = topicsArray.find((topic) => topic.id === topicId);
  const newMessage = { message, id: randomUUID() };
  console.log(topic);
  if (!topic) {
    return;
  }

  topic.messages = topic.messages
    ? [...topic.messages, newMessage]
    : [newMessage];
  res.send(topic);
  io.emit("new topic messages", topic.messages);
});

app.post("/topics/:name", async (req, res) => {
  const { name } = req.params;
  console.log(req.params);
  const newTopic = {
    id: randomUUID(),
    name,
    rf: 3,
    spread: 100,
    particion: 25,
    messages: [],
  };
  const topicsArray = [...data];
  const newArray = [...topicsArray, newTopic];
  fs.writeFile("topics.json", JSON.stringify(newArray), (err) => {
    if (err) throw err;
    console.log("done writing....");
  });
  io.emit("new topics", newArray);
  res.send(newArray);
});

server.listen(port, () => console.log("Listening on port 3001"));
