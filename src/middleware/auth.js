const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    let token = req.header("authorization").replace("Bearer ", "");
    let decodedToken = jwt.verify(token, "cric-rivals-jwt-secret");

    let user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    }).populate("selectedTeam");

    if (!user) {
      throw new Error("Authorization failed");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    next(new Error("Authorization failed"));
  }
};

module.exports = auth;
