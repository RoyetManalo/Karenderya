const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add firstName"],
  },
  lastName: {
    type: String,
    required: [true, "Please add lastName"],
  },
  email: {
    type: String,
    required: [true, "Please add email"],
  },
  storeName: {
    type: String,
    required: [true, "Please add username"],
  },
  password: {
    type: String,
    required: [true, "Please add password"],
  },
  address: {
    type: String,
    required: [true, "Please add address"],
  },
  phone: {
    type: String,
    required: [true, "Please add phone"],
  },
});

module.exports = mongoose.model("Owner", ownerSchema);
