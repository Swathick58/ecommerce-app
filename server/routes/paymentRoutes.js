const express = require("express");
const router = express.Router();

// Simple payment order (no secret key needed for demo)
router.post("/order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
  };

  res.json(options);
});

module.exports = router;