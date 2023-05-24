const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Ride = mongoose.model("Ride");

//Checking if a driver has ride active

router.post("/findActiveRide", async (req, res) => {
  const { driverId } = req.body;
  console.log(driverId);
  try {
    const ride = await Ride.findOne({ driverId: driverId, isActive: true });

    if (ride) {
      console.log("Current Driver has an active ride");
      return res.status(200).send({ found: true });
    } else {
      console.log("Current Driver has no active ride");
      return res.status(200).send({ found: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
});

router.post("/findRide", async (req, res) => {
  const { startLocation, endLocation, startTime } = req.body;
  const time = new Date(startTime);
  const beginTime = new Date(
    time.getTime() - 30 * 60000 - time.getTimezoneOffset() * 60000
  );
  const endTime = new Date(
    time.getTime() + 30 * 60000 - time.getTimezoneOffset() * 60000
  );
  const condition = {
    startLocation: startLocation,
    endLocation: endLocation,
    startTime: { $gte: beginTime, $lte: endTime },
  };
  const result = await Ride.find(condition).exec();

  return res.status(200).send(result);
});

module.exports = router;
