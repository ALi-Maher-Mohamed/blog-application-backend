const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB ^_^");
  } catch (error) {
    _;
    console.log("Connection Failed", err);
  }
};
