lat mongoose = require('mongoose');

let UserTeamSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    playingXI: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ]
})

module.exports = mongoose.model("UserTeam", UserTeamSchema);