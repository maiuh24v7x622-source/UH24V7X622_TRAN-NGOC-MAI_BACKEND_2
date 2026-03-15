const bcrypt = require("bcrypt");
const MongoDB = require("../utils/mongodb.util");
const User = require("../models/user.model");
const jwtUtil = require("../utils/jwt.util");

const usersCollection = () => {
  return MongoDB.client.db().collection("users");
};

/**
 * =========================
 * REGISTER
 * =========================
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await usersCollection().findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name || "",
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const result = await usersCollection().insertOne(user);

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await usersCollection().findOne({
      email: normalizedEmail,
    });

    // Bảo mật: không tiết lộ email hay password sai
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwtUtil.generateToken(user);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
