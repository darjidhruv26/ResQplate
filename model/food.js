const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  foodPublisher: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  image: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  amount: {
    type: String,
  },

  feedAbout: {
    type: String,
  },

  matter: {
    type: String,
  },

  expiresTime: {
    type: String,
  },
});

module.exports = mongoose.model("Food", foodSchema);
