const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    rideId: {type: String},
    driverId: {type: String},
    passengers: {type: []},
    startLocation: {type: String},
    endLocation: {type: String},
    startTime: {type: Date},
    rideCost: {type: Number},
    capacity: {type: Number}
}, {timestamps: true});

mongoose.model("Ride", rideSchema)