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
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      order: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("UserTeam", UserTeamSchema);
