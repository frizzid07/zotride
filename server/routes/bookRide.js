const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const User = mongoose.model("User");

router.put("/bookRide", async (req, res) => {
  const { ride, userId } = req.body.data;
  const result = await Ride.find({ _id: ride._id }).exec();
  const old_capacity = result[0].capacity;

  Ride.findOneAndUpdate(
    { _id: ride._id },
    { $push: { passengers: userId }, capacity: old_capacity - 1 },
    { new: true }
  ).exec();

  User.findOneAndUpdate(
    { _id: userId },
    { $push: { past_rides: ride._id } },
    { new: true }
  ).exec();

  return res.status(200).send();
});

module.exports = router;
