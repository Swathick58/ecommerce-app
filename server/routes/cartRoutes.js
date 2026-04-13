const express = require("express");
const router = express.Router();
const { saveCart, getCart } = require("../controllers/cartController");

router.post("/", saveCart);
router.get("/:user", getCart);

module.exports = router;