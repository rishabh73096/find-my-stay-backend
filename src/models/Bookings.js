const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rooms', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    status: {
      type: String,
      enum: ["requested", "approved", "visited", "pending_payment", "paid", "cancelled"],
      default: "requested",
    },

    bookingCode: { type: String, unique: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["online", "cash", "upi"] },

    visitDate: { type: Date, required: true },
    bedCountBooked: { type: Number, default: 1 },

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
