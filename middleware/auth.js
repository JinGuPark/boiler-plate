const { User } = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.cookies.x_auth;

  try {
    const user = await User.findByToken(token);
    if (!user) {
      return res.json({ isAuth: false, error: true });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

module.exports = { auth };
