const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rooms',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'visited',
        'pending_payment',
        'paid',
        'cancelled',
      ],
      default: 'requested',
    },

    totalAmount: { type: Number, required: true },
    roomPriceAtBooking: { type: Number },
    paymentMethod: { type: String, enum: ['online', 'cash', 'upi'] },
    visitDate: { type: Date, required: true },
    bedCountBooked: { type: Number, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bookings', bookingSchema);
