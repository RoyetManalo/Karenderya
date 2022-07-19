const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: [true, "Please input ownerId"],
  },
  name: {
    type: String,
    required: [true, "Please input name"],
  },
  description: {
    type: String,
    required: [true, "Please input description"],
  },
  price: {
    type: Number,
    required: [true, "Please input price"],
  },
  isSoldOut: {
    type: Boolean,
    required: [true, "Please input isSoldOut"],
  },
});

module.exports = mongoose.model("Product", productSchema);
