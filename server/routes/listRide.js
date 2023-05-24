const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ride = mongoose.model("Ride");
require("dotenv").config();

router.post("/listRide", async (req, res) => {
  console.log("Received Listing Request");
  const {
    rideId,
    driverId,
    startLocation,
    endLocation,
    startTime,
    rideCost,
    capacity,
    isActive,
  } = req.body;
  const ride = new Ride({
    rideId,
    driverId,
    startLocation,
    endLocation,
    startTime,
    rideCost,
    capacity,
    isActive,
  });

  if (
    !rideId ||
    !driverId ||
    !startLocation ||
    !endLocation ||
    !startTime ||
    !rideCost ||
    !capacity
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    await ride.save();
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }

  return res.status(200).json({ added: true });
});

module.exports = router;
