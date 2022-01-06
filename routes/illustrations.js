const express = require("express");
const router = express.Router();

let illustrationData = require('../illustrationData');

router.get("/list", async (req, res) => {
  try {
    res.status(200).json({
      data: players
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occured",
      err
    });
  }
});