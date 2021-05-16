let mongoose = require("mongoose");

let UserTeamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  squad: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});

module.exports = mongoose.model("UserTeam", UserTeamSchema);
