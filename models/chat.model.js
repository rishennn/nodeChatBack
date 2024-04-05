const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({});

module.exports = mongoose.model('chats', ChatSchema);
