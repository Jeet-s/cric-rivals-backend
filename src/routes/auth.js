const express = require("express");
const passport = require("passport");

const auth = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://cric-rivals.web.app",
    failureRedirect: "https://cric-rivals.web.app",
  })
);

router.post("/auth/login", async (req, res) => {
  try {
    let profile = req.body;
    const existingUser = await User.findOne({
      googleId: req.body.googleId,
    }).populate();

    if (existingUser) {
      let token = await existingUser.generateAuthToken();
      res.send({
        user: existingUser,
        token,
      });
      return;
    }

    const user = await new User({
      googleId: req.body.googleId,
      username: req.body.username,
      email: req.body.email,
      image: req.body.image,
    }).save();

    let token = await user.generateAuthToken();

    res.send({
      user,
      token,
    });
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/auth/current-user", auth, async (req, res) => {
  try {
    res.send({
      user: req.user,
      token: req.token,
    });
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
