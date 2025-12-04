'use strict';
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    propertyName: { type: String, required: true },

    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      required: true
    },

    pricePerMonth: {
      type: Number,
      required: true,
      min: 0
    },

    beds: {
      total: { type: Number, required: true },
      available: { type: Number, required: true }
    },

    genderAllowed: {
      type: String,
      enum: ['Boys', 'Girls', 'Any'],
      default: 'Any'
    },

    address: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    images: [{ type: String }], // Optional but recommended

    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rooms', roomSchema);
