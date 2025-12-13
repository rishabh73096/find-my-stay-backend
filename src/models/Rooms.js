const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    propertyName: { type: String, required: true },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Dormitory"],
      required: true
    },

    pricePerMonth: {
      type: Number,
      required: true,
      min: 0
    },

    // ✔ Matching your payload: availableBeds + totalBeds
    totalBeds: {
      type: Number,
      required: true
    },

    availableBeds: {
      type: Number,
      required: true
    },

    genderAllowed: {
      type: String,
      enum: ["Boys", "Girls", "Any"],
      default: "Any"
    },

    // ✔ Payload has city, state, pincode, + address (street/area)
    address: {
      type: String, // e.g., "vijaynagar"
      required: true
    },

    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    images: [{ type: String }],

    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rooms", roomSchema);
