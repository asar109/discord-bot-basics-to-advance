const { Schema,  model } = require("mongoose");

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastTime: {
    type: Date,
    required: true,
  },
});
const userModal = model("User", userSchema);

module.exports = userModal;
