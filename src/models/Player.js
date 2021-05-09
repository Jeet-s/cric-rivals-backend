let mongoose = require("mongoose");

let PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  battingRating: {
    type: Number,
    required: true,
  },
  bowlingRating: {
    type: Number,
    required: true,
  },
  bowlerSpeed: {
    type: Number,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  category: {
    type: Number,
    required: true,
  },
  isOverseas: {
    type: Boolean,
    required: true,
  },
  isWicketKeeper: {
    type: Boolean,
    default: false,
  },
  isCaptain: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
