const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");

router.post("/findRide", async (req, res) => {
  const { startLocation, endLocation, startTime, startRadius, endRadius } =
    req.body.data;
  const time = new Date(startTime);
  const beginTime = new Date(
    time.getTime() - 30 * 60000
  );
  const endTime = new Date(
    time.getTime() + 30 * 60000
  );
  const condition = { startTime: { $gte: beginTime, $lte: endTime }, capacity:{$gt:0} };
  const rides = await Ride.find(condition).exec();
  const result = rides.filter((ride) => {
    return (
      isWithinRadius(
        ride.startLocation.latitude,
        ride.startLocation.longitude,
        startLocation.latitude,
        startLocation.longitude,
        startRadius
      ) &&
      isWithinRadius(
        ride.endLocation.latitude,
        ride.endLocation.longitude,
        endLocation.latitude,
        endLocation.longitude,
        endRadius
      )
    );
  });

  return res.status(200).send(result);
});

function isWithinRadius(lat1, lon1, lat2, lon2, radius) {
  const earthRadius = 3958.8; // Radius of the Earth in miles

  // Convert latitude and longitude to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences between the coordinates
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Calculate the distance using the Haversine formula
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  // Check if the distance is within the specified radius
  return distance <= radius;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

router.post("/findActiveRide", async (req, res) => {
  const { driverId } = req.body.data;
  console.log(driverId);
  try {
    const ride = await Ride.findOne({ driverId: driverId, isActive: true });

    if (ride) {
      console.log("Current Driver has an active ride");
      return res.status(200).send({ ride });
    } else {
      console.log("Current Driver has no active ride");
      return res.status(200).send({});
    }
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
});

module.exports = router;
