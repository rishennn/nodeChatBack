const ChatSchema = require("../models/chat.model");

class ChatModels {
  static async getChats() {
    try {
      const data = await ChatSchema.find({});
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  static async getChat(query) {
    try {
      const data = await ChatSchema.findOne(query);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  static async createChat(state) {
    try {
      await ChatSchema.insertMany(state);
      const data = await ChatModels.getChats();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  static async addMessage(query, message) {
    try {
      const data = await ChatSchema.findOneAndUpdate(
        query,
        { $push: { data: message } },
        { new: true }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  static async changeOnline(query, countOnline) {
    try {
      const data = await ChatSchema.findOneAndUpdate(
        query,
        { online: countOnline },
        { new: true }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ChatModels;
