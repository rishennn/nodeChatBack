const mongoose = require("mongoose");

const connectDB = async (DATABASE_URI) => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("Database connected...");
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDB;
