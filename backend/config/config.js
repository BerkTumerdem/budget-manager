require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
};
