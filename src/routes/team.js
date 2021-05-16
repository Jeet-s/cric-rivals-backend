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

router.get("/teams/user/squad/:userId", async (req, res) => {
  try {
    let userTeam = await UserTeam.findOne({ userId: req.params.userId });
    let team = await Team.findOne({ _id: userTeam.teamId })
      .populate("squad")
      .lean();
    // let squad = team.squad.toArray();
    team.squad = team.squad.map((p) => {
      p.order = userTeam.squad.find((x) => x.playerId.equals(p._id)).order;
      return p;
    });
    res.send(team.squad);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/teams/user", auth, async (req, res) => {
  try {
    if (req.user.selectedTeam) {
      let userTeam = await UserTeam.updateOne(
        { _id: req.user.selectedTeam._id },
        {
          $set: {
            teamId: req.body._id,
            squad: req.body.squad.map((x) => ({
              playerId: new mongoose.Types.ObjectId(x._id),
              order: x.order,
            })),
          },
        }
      );
      res.send(userTeam);
    } else {
      let userTeam = await UserTeam.create({
        userId: req.user._id,
        teamId: req.body._id,
        squad: req.body.squad.map((x) => ({
          playerId: new mongoose.Types.ObjectId(x._id),
          order: x.order,
        })),
      });
      req.user.selectedTeam = userTeam._id;
      await req.user.save();
      res.send(userTeam);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
