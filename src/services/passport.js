const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (ex) {
    done(ex);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID:
        "369981317656-jtpp2hmug0psho57rolcia2rj93sct6v.apps.googleusercontent.com",
      clientSecret: "M33Nnth1z7spks-hyZShARxi",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {}
  )
);
