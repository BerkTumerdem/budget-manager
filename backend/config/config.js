require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "production" && !jwtSecret) {
  console.error("FATAL: JWT_SECRET must be set in production.");
  process.exit(1);
}

module.exports = {
  mongoURI: process.env.MONGO_URI || "",
  jwtSecret: jwtSecret || "dev_secret_change_me",
};
