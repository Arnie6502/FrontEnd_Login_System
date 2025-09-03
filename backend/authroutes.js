const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user"); // Remove duplicate import
const router = express.Router();

// Move to environment variables for security
const JWT_SECRET = process.env.JWT_SECRET || "SDNBFBFMSCS";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const thisUserExists = await User.findOne({ username });
    if (thisUserExists) {
      return res
        .status(409)
        .json({ message: "User already exists, please Login" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/protected", (req, res) => {
  // Better token parsing - handles "Bearer token" format
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({ message: "Protected data", user: decoded });
  });
});

// Single module.exports at the end
module.exports = router;
