const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

const Ride = mongoose.model("Ride");
const User = mongoose.model("User");

router.post("/findRide", async (req, res) => {
  const { startLocation, endLocation, startTime, startRadius, endRadius } =
    req.body;
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

router.get("/findActiveRide", async (req, res) => {
  var driverId = null, passId = null;
  if(req.query.driverId !== undefined) {
    driverId = req.query.driverId;
  } else {
    passId = req.query.userId;
  }
  try {
    var ride = null, rideList = null;
    if(driverId !== null) {
      ride = await Ride.findOne({ driverId: driverId, isActive: true });
    } else if(passId !== null){
      rideList = await Ride.find({ passengers: { $elemMatch: { $eq: passId } }, isActive: true });
      if(rideList.length !== 0) {
        ride = rideList.map((rideInfo) => {
          return { rideDetails: rideInfo };
        });
      }
    }
    if (ride) {
      console.log("Current User has an active ride");
      return res.status(200).send({ active: true, ride });
    } else {
      console.log("Current User has no active ride");
      return res.status(200).send({ active: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
});

router.get("/getRides", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findOne({ _id: userId}).exec();
    console.log(`User ID: ${user}`);
    const currentRides = [], pastRides = []
    if(user.activePassengerRides) {
      for(let i=0;i<user.activePassengerRides.length;i++){
        let ride = await Ride.findOne({ _id: user.activePassengerRides[i]}).exec();
        console.log(`Ride is ${ride}`);
        let driver = await User.findOne({ _id: ride.driverId}).exec();
        console.log(`Driver is ${driver}`);
        let driverDetails = {
          "firstName":driver.firstName,
          "lastName":driver.lastName,
          "mobile":driver.mobileNumber
        }
        currentRides.push({"rideDetails":ride,"driverDetails":driverDetails});
      }
    }
    if(user.past_rides) {
      for(let i=0;i<user.past_rides.length;i++){
        let ride = await Ride.findOne({ _id: user.past_rides[i]}).exec();
        console.log(`Ride is ${ride}`);
        let driver = await User.findOne({ _id: ride.driverId}).exec();
        console.log(`Driver is ${driver}`);
        let driverDetails = {
          "firstName":driver.firstName,
          "lastName":driver.lastName,
          "mobile":driver.mobileNumber
        }
        pastRides.push({"rideDetails":ride,"driverDetails":driverDetails});
      }
    }
    return res.status(200).send({ currentRides, pastRides });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.get("/getDriverRides", async (req, res) => {
  const driverId  = req.query.driverId;
  try {
    const currentRide = await Ride.findOne({ driverId: driverId, isActive: true}).exec();
    const currentRidesList = [], pastRidesList = []
    if(currentRide) {
        let passengers = [];
        for(let j=0;j<currentRide.passengers.length;j++){
          const passenger = await User.findOne({ _id: currentRide.passengers[j]}).exec();
          passengers.push({"firstName":passenger.firstName,"lastName":passenger.lastName});
        }
        currentRidesList.push({"rideDetails":currentRide,"passengerDetails":passengers});
    }
    const pastRides = await Ride.find({ driverId: driverId, isActive: false}).exec();
    if(pastRides) {
      for(let i=0;i<pastRides.length;i++){
        let passengers = [];
        for(let j=0;j<pastRides[i].passengers.length;j++){
          const passenger = await User.findOne({ _id: pastRides[i].passengers[j]}).exec();
          passengers.push({"firstName":passenger.firstName,"lastName":passenger.lastName});
        }
        pastRidesList.push({"rideDetails":pastRides[i],"passengerDetails":passengers});
      }
    }
    return res.status(200).send({ currentRidesList, pastRidesList });
  } catch (err) {
    return res.status(422).json({ error: err });
  }

});

router.get("/getRide", async (req, res) => {
  const rideId = req.query.rideId;
  try {
    const ride = await Ride.findOne({ _id: rideId }).exec();
    return res.status(200).send({ ride });
  } catch(err) {
    return res.status(422).json({ error: err });
  }
});

router.get("/endTrip", async (req, res) => {
  const userId = req.query.userId;
  const rideId = req.query.rideId;
  console.log(userId, rideId);
  try {
    await Ride.updateOne(
      { _id: rideId },
      { $pull: { passengers: userId } ,
      $inc: { capacity: 1 } },
      { new: true }
    ).exec();
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { past_rides: rideId },
      $pull: { activePassengerRides: rideId } },
      { new: true }
    ).exec();
    const user = await User.findOne({ _id: userId }).exec();
    console.log(`User Details ${user}`);
    return res.status(200).send({success: 'Trip ended successfully!'});
  } catch(error) {
    return res.status(422).json({ error: error });
  }
});

router.get("/cancelTrip", async (req, res) => {
  const userId = req.query.userId;
  const rideId = req.query.rideId;
  try {
    await Ride.updateOne(
      { _id: rideId },
      { $pull: { passengers: userId } ,
      $inc: { capacity: 1 } },
      { new: true }
    ).exec();
    const ride = await Ride.findOne({ _id: rideId }).exec();
    console.log(`Ride Details ${ride}`);
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { activePassengerRides: rideId } },
      { new: true }
    ).exec();
    const user = await User.findOne({ _id: userId }).exec();
    console.log(`User Details ${user}`);
    return res.status(200).send({success: 'Trip cancelled successfully!'});
  } catch(error) {
    return res.status(422).json({ error: error });
  }
});

// router.put("/populateRides", async (req, res) => {
//   const userId = req.query.userId;
//   const { rides } = req.body;

//   try {
//     const updatedUser = await User.findOne({ _id: userId });
//     console.log(updatedUser);
//     if(updatedUser) {
//       updatedUser.activePassengerRides = rides
//       await updatedUser.save();
//       console.log("User registration updated successfully");
//       return res.status(200).send({ updatedUser });
//     } else {
//       return res.status(404).send({ error: "User not found" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ error: "Failed to update user" });
//   }
// });

module.exports = router;