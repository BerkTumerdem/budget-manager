const mongoose = require("mongoose");
const config = require("./config");

let memoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = config.mongoURI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === "production") {
        console.error("FATAL: MONGO_URI must be set in production.");
        process.exit(1);
      }
      const { MongoMemoryServer } = require("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      console.log("MongoDB memory server started...");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
