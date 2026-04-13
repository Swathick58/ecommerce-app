const Order = require("../models/Order");

// Save order
exports.createOrder = async (req, res) => {
  const { user, items, total } = req.body;

  const order = new Order({
    user,
    items,
    total,
  });

  await order.save();

  res.json({ message: "Order placed successfully" });
};

// Get orders
exports.getOrders = async (req, res) => {
  const { user } = req.params;

  const orders = await Order.find({ user });
  res.json(orders);
};