const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ride = mongoose.model("Ride");
const User = mongoose.model("User");
require("dotenv").config();

router.post("/listRide", async (req, res) => {
  console.log("Received Listing Request");
  console.log(req.body.data);
  const {
    rideId,
    driverId,
    startLocation,
    endLocation,
    startTime,
    rideCost,
    capacity,
    isActive,
  } = req.body.data;

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
    const rideNew = await Ride.findOne({ driverId: driverId });
    const user = await User.findOne({ _id: driverId });
    console.log(user);
    if(user) {
      user.activeDriverRide = rideNew._id;
      await user.save();
      console.log("User details updated successfully");
    } else {
      return res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }

  return res.status(200).json({ added: true, rideId: rideId });
});

module.exports = router;