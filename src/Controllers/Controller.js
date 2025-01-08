const User = require("../Models/User");
const mongoose = require("mongoose");
const { hashString, passwordString } = require("../utils/index");

class Controllers {
  Signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      const userChcek = await User.findOne({ email });
      if (userChcek) {
        return res.status(400).json({ message: "User already register" });
      }
      const passwordHash = hashString(password);
      const createUSer = await User.create({
        name,
        email,
        password: passwordHash,
      });
      if (createUSer) {
        res
          .status(201)
          .json({ message: "User Create Sucessfully", createUSer });
      } else {
        res.status(400).json({ message: "Failed to craete user" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  Signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userCheck = await User.findOne({ email });

      if (!userCheck) {
        return res.status(400).json({ message: "user not found" });
      }

      const isPasswordCorrect = await passwordString(
        password,
        userCheck.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Email or Password Incorrect" });
      }
      return res.status(200).json({ message: "Signin Sucessfully", userCheck });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  };

  CountinueWithGoogle = async (req, res) => {
    try {
      const { displayName, email } = req.body;
      const data = await User.findOne({ email });
      if (data) {
        return res.status(200).json({ message: "old user", data });
      }
      const createUser = await User.create({
        name: displayName,
        email,
        googleUser: true,
      });
      if (createUser) {
        res.status(200).json({ message: "user create", data: createUser });
      }
    } catch (error) {
      console.log(error);
    }
  };

  GetOtherUsers = async (req, res) => {
    try {
      const { id } = req.params;

      const checkUser = await User.find({
        _id: { $ne: id },
      }).select("-password");

      res.status(200).json({ checkUser });
    } catch (error) {}
  };

  UpdateUser = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      console.log(req.body);
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedUser) {
        res.status(200).json({ updatedUser });
      } else {
        res.status(400).json({ message: "Cannot update user" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server errror" });
    }
  };

  GetByRecieverId = async (req, res) => {
    try {
      const _id = req.params.id;
      console.log(_id);
      const newObjectId = new mongoose.Types.ObjectId(_id);
      const user = await User.findById(newObjectId);
      if (user) {
        res.status(200).json(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new Controllers();
