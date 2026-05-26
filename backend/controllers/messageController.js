import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId: userToChatId,
        },

        {
          senderId: userToChatId,
          receiverId: senderId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};