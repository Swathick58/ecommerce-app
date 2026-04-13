const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);