const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "visited",
        "pending_payment",
        "paid",
        "cancelled"
      ],
      default: "requested",
    },

    bookingCode: { type: String, unique: true },

    // Pricing System
    roomPriceAtBooking: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Payment Tracking
    paymentMethod: { type: String, enum: ["online", "cash", "upi"] },
    paymentId: { type: String },
    refundAmount: { type: Number, default: 0 },
    isRefundable: { type: Boolean, default: true },

    // Visit / Stay
    visitDate: { type: Date },
    stayStartDate: { type: Date },
    stayEndDate: { type: Date },
    durationMonths: { type: Number },

    // Tracking
    bedCountBooked: { type: Number, default: 1 },
    autoCancelAt: { type: Date },
    cancellationReason: { type: String },

    // Feedback
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },

    // Customer Docs
    documents: [
      {
        type: { type: String, enum: ["Aadhar", "College-ID", "Other"] },
        url: String,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookings', bookingSchema);
