const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");
const User = require("../Models/User");
const mongoose = require("mongoose");
const { recieverId, io } = require("../socket/socketio");
const { json } = require("express");

class messageControls {
  getConversations = async (req, res) => {
    try {
      const { sender_id, reciever_id } = req.params;

      console.log(req.params, "req.params");

      const senderObjectId = new mongoose.Types.ObjectId(sender_id);
      const receiverObjectId = new mongoose.Types.ObjectId(reciever_id);

      let data, messages, participants, response;

      data = await Conversation.findOne({
        participants: { $all: [senderObjectId, receiverObjectId] },
      })
        .populate("messages")
        .populate("participants");

      // Access `conversation.messages` and `conversation.participants` as needed.

      if (data) {
        participants = data?.participants;
        messages = data?.messages;
        response = { participants, messages };
        res.status(200).json(response);
      } else {
        data = await User.findById(receiverObjectId);
        participants = [data];
        messages = [];
        response = { participants, messages };
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(500).json("system error");
      console.log(error);
    }
  };
  sendMessage = async (req, res) => {
    try {
      const { sender_id, reciever_id, message } = req.body;
      console.log(req.body);

      const senderObjectId = new mongoose.Types.ObjectId(sender_id);
      const receiverObjectId = new mongoose.Types.ObjectId(reciever_id);

      let checkConversation = await Conversation.findOne({
        participants: { $all: [senderObjectId, receiverObjectId] },
      });

      // If no conversation exists, create a new one
      if (!checkConversation) {
        checkConversation = await Conversation.create({
          participants: [senderObjectId, receiverObjectId],
        });
      }

      // Create the message
      const createMessage = await Message.create({
        sender_id: senderObjectId,
        reciever_id: receiverObjectId,
        message: message,
      });

      // Push the message ID into the conversation's messages array
      if (createMessage) {
        checkConversation.messages.push(createMessage._id);
      }

      // Save the conversation
      await checkConversation.save();

      const newReciever = recieverId(reciever_id);
      if (newReciever) {
        io.to(newReciever).emit("createMessage", createMessage);
      }

      res
        .status(200)
        .json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
  getMessages = async (req, res) => {
    const { reciever_id, sender_id } = req.params;
    const messages = await Conversation.findOne({
      participants: { $all: [reciever_id, sender_id] },
    }).populate("messages");
    res.status(200).json(messages);
  };
  getFriendUsers = async (req, res) => {
    const { id } = req.params;
    const conversations = await Conversation.find({
      participants: { $in: [id] },
    })
      .select("participants")
      .populate("participants");

    const filteredUsers = conversations
      .flatMap((value) => value?.participants)
      .filter((user) => user._id !== id);

    res.status(200).json(filteredUsers);
  };
}

module.exports = new messageControls();
