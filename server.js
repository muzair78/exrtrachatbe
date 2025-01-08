const express = require("express");
const mongoose = require("mongoose");
const { server, App } = require("./src/socket/socketio");
require("dotenv").config();
const PORT = process.env.PORT;
const apiRoutes = require("./src/Routes/index");
const cors = require("cors");

App.use(cors());
App.use(express.json());

App.use(express.urlencoded({ limit: "25mb", extended: true }));

App.use(express.static("build"));
App.use("/public", express.static("public"));
App.use("/api", apiRoutes);

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB successfully connected!");
  })
  .catch((err) => {
    console.log("err :>> ", err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
