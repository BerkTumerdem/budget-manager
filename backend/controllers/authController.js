const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const constants = require("../config/constants");
const getMessage = require("../utils/messages"); // ✔️ Importul corect

exports.registerUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  const lang = req.headers["accept-language"] || constants.LANGUAGE.DEFAULT;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: getMessage(lang, "userExists") });
    }

    user = new User({ email, password });
    await user.save();

    const payload = { user: { id: user.id, email: user.email } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: constants.JWT.EXPIRATION });

    res.json({ token, msg: getMessage(lang, "userCreated") });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};

exports.loginUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  const lang = req.headers["accept-language"] || constants.LANGUAGE.DEFAULT;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: getMessage(lang, "invalidCredentials") });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: getMessage(lang, "invalidCredentials") });
    }

    const payload = { user: { id: user.id, email: user.email } };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: constants.JWT.EXPIRATION });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(getMessage(lang, "serverError"));
  }
};
