const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please input userId"],
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Please input totalPrice"],
  },
  dateCreated: {
    type: String,
    required: [true, "Please input dateCreated"],
  },
  dateDelivered: {
    type: String,
  },
  isDelivered: {
    type: Boolean,
    required: [true, "Please input isSoldOut"],
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
