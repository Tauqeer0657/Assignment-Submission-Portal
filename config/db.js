// // import { configDotenv } from "dotenv";
// const mongoose = require('mongoose');

// // configDotenv();

// export const connection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Database connected");
//   } catch (error) {
//     console.log("Error connecting to database", error);
//   }
// };

const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
module.exports = connectDB;
