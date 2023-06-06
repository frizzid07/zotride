const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const User = mongoose.model("User");

router.put("/bookRide", async (req, res) => {
  const { rideId, userId } = req.body;
  console.log(rideId, userId);
  const result = await Ride.findOne({ _id: rideId }).exec();
  console.log(`Result of finding a user: ${result}`);
  
  if(result) {
    const old_capacity = result.capacity;
    // if(result.passengers.includes(userId)) {
    //   console.log('Passenger already exists');
    //   return res.status(422).send({error: 'You are already a passenger in this ride'});
    // } else {
      await Ride.updateOne(
        { _id: rideId },
        { $addToSet: { passengers: userId }, capacity: old_capacity - 1 },
        { new: true }
      ).exec();
      console.log('Updated Ride');
      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { past_rides: rideId } },
        { new: true }
      ).exec();
      console.log('Updated User');
      return res.status(200).send({success: 'Seat booked successfully!'});
    // }
  } else {
    res.status(404).send({error: 'Ride not found'});
  }
});

module.exports = router;