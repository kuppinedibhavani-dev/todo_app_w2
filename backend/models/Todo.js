const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

});

module.exports = mongoose.model("Todo", todoSchema);