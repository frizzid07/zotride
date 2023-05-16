const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    licenseNumber: { type: String },
    userId: { type: String },
    vehicleInformation: [
      {
        vehicleNumber: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        vehicleCapacity: { type: Number, required: true },
        vehicleColor: { type: String, required: true },
        vehicleCompany: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Driver", driverSchema);
