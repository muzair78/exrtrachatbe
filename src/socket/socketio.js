const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const App = express();
const server = http.createServer(App);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update with frontend origin
    methods: ["GET", "POST"],
  },
});

// messages sockio

const recieverId = (id) => {
  return users[id];
};

const users = {};

io.on("connection", (socket) => {
  console.log("Socket.IO user connection successful", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
  }
  console.log(users, "userID");

  io.emit("getonline", Object.keys(users));

  // console.log("Handshake details:", socket.handshake);

  socket.on("disconnect", () => {
    console.log("this user is disconnected", socket.id);
    delete users[userId];
    io.emit("getonline", Object.keys(users));
  });
});

module.exports = { io, server, App, recieverId };
