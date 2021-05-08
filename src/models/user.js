const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid");
        }
      },
    },
    googleId: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    image: {
      type: String,
    },
    selectedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTeam",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.tokens;

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign(
    { _id: this._id.toString() },
    "cric-rivals-jwt-secret"
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, passord) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("unable to login");

  const isMatched = await bcrypt.compare(passord, user.passord);

  if (!isMatched) throw new Error("Unable to login");

  return user;
};

userSchema.pre("validate", async function (next) {
  if (!this.googleId) {
    throw new Error("Validation failed");
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
