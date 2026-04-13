const User = require("../models/User");

// Register
exports.register = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User registered" });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
};