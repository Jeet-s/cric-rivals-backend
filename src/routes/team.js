const express = require("express");
const auth = require("../middleware/auth");
const Team = require("../models/Team");
const router = express.Router();

router.get("/teams/all", auth, async (req, res) => {
  try {
    let teams = await Team.find();
    res.send(teams);
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
