const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ride = mongoose.model('Ride');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/listRide', async (req, res) => {
    const { rideId, driverId, passengers, startLocation, endLocation, startTime, rideCost } = req.body;
    const ride = new Ride({
        rideId, driverId, passengers, startLocation, endLocation, startTime, rideCost
    });
    try{
        await ride.save();
    }
    catch(err){
        return res.status(422).send({error: err.message});
    }
    
    return res.status(200).send();

});

module.exports = router;