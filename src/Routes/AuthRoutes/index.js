const express = require("express");
const App = express.Router();
const Controllers = require("../../Controllers/Controller");
const messageControls = require("../../Controllers/messageController");

App.post("/Signup", Controllers.Signup);
App.post("/Signin", Controllers.Signin);
App.get("/users/:id", Controllers.GetOtherUsers);
App.post("/sendmessage", messageControls.sendMessage);
App.get("/getMessages/reciever_id/sender_id", messageControls.getMessages);
App.post("/googleAuth", Controllers.CountinueWithGoogle);
App.get(
  "/getconversations/:sender_id/:reciever_id",
  messageControls.getConversations
);
App.patch("/updateUsers/:id", Controllers.UpdateUser);
App.get("/getUserConversations/:id", messageControls.getFriendUsers);
App.get("/getByRecieverId/:id", Controllers.GetByRecieverId);
module.exports = App;
