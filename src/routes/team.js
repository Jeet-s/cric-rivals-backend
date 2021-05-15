const express = require("express");
const auth = require("../middleware/auth");
const Team = require("../models/Team");
const router = express.Router();

router.get("/teams/all", async (req, res) => {
  try {
    let teams = await Team.find().populate("squad");
    res.send(teams);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/teams/all/basic", async (req, res) => {
  try {
    let teams = await Team.find();
    res.send(teams);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
