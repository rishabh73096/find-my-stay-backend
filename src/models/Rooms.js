'use strict';
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin/PG-Owner/User who posted the room
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

    totalBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },

    genderAllowed: {
      type: String,
      enum: ['Boys', 'Girls', 'Any'],
      default: 'Any'
    },

    amenities: {
      wifi: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      mealIncluded: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      parking: { type: Boolean, default: false }
    },

    address: {
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number }
    },

    images: [{ type: String }], // Cloudinary/Local image URLs

    description: { type: String },
    
    isAvailable: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Rooms', roomSchema);
