const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    rideId: {type: String},
    driverId: {type: String},
    passengers: {type: []},
    startLocation: [
        {

          description: { type: String, required: true },
          latitude: { type: mongoose.Types.Decimal128, required: true },
          longitude: { type: mongoose.Types.Decimal128, required: true }
        },
      ],
    endLocation: [
        {

          description: { type: String, required: true },
          latitude: { type: mongoose.Types.Decimal128, required: true },
          longitude: { type: mongoose.Types.Decimal128, required: true }
        },
      ],
    startTime: {type: Date},
    rideCost: {type: Number},
    capacity: {type: Number}
}, {timestamps: true});

mongoose.model("Ride", rideSchema)