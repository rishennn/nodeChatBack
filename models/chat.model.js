const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  idRoom: { type: String, required: true },
  name: { type: String, required: true },
  online: { type: Number, required: true, default: 0 },
  author: { type: Object, required: true },
  data: { type: Array, required: true, default: [] },
});

module.exports = mongoose.model('chats', ChatSchema);
