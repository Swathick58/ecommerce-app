const Cart = require("../models/Cart");

// Save cart
exports.saveCart = async (req, res) => {
  const { user, items } = req.body;

  let cart = await Cart.findOne({ user });

  if (cart) {
    cart.items = items;
  } else {
    cart = new Cart({ user, items });
  }

  await cart.save();
  res.json({ message: "Cart saved" });
};

// Get cart
exports.getCart = async (req, res) => {
  const { user } = req.params;
  const cart = await Cart.findOne({ user });
  res.json(cart);
};