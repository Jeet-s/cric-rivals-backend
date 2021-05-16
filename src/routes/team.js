const express = require("express");
const auth = require("../middleware/auth");
const Team = require("../models/Team");
const UserTeam = require("../models/UserTeam");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/teams/all", auth, async (req, res) => {
  try {
    let teams = await Team.find().populate("squad");
    res.send(teams);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/teams/all/basic", auth, async (req, res) => {
  try {
    let teams = await Team.find();
    res.send(teams);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("teams/user", auth, async (req, res) => {
  try {
    if (auth.user.selectedTeam) {
      let userTeam = await UserTeam.updateOne(
        { _id: auth.user.selectedTeam._id },
        {
          $set: {
            teamId: req.body._id,
            squad: req.body.squad.map(
              (x) => new mongoose.Types.ObjectId(x._id)
            ),
          },
        }
      );
      res.send(userTeam);
    } else {
      let userTeam = await UserTeam.create({
        userId: auth.user._id,
        teamId: req.body._id,
        squad: req.body.squad.map((x) => new mongoose.Types.ObjectId(x._id)),
      });
      auth.user.selectedTeam = userTeam._id;
      await auth.user.save();
      res.send(userTeam);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
