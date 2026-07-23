const jwt = require("jsonwebtoken");
const config = require("../config/config");
const getMessage = require("../utils/messages");

module.exports = function (req, res, next) {
  const lang = req.headers["accept-language"] || "en";
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: getMessage(lang, "noToken") });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: getMessage(lang, "invalidToken") });
  }
};
