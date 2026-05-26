import User from "../models/userModel.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import sendEmail from "../utils/sendEmail.js";

// generate token
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // generate otp
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // otp expiry -> 5 minutes
    const otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    // send otp email
    await sendEmail(
      email,
      "Verify Your Account",
      otp
    );

    res.status(201).json({
      message:
        "OTP sent to your email",
      email,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check otp
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // check expiry
    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // verify user
    user.isVerified = true;

    user.otp = "";

    user.otpExpires = null;

    await user.save();

    // token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,

      secure: true,

      sameSite: "none",

      path: "/",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// resend otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate new otp
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;

    user.otpExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    // send email
    await sendEmail(
      email,
      "Resend OTP",
      `Your new OTP is: ${otp}`
    );

    res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // check verified
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Please verify your email first",
      });
    }

    // compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // token
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,

      secure: true,

      sameSite: "none",

      path: "/",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// check auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};