const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: String },
    amount: { type: Number },
    currency: {type: String, default: 'USD'},
    transactions: { type: [] },
  },
  { timestamps: true }
);

mongoose.model("Wallet", walletSchema);