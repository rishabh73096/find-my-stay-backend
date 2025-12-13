'use strict';

const Booking = require('../models/Bookings');
const Rooms = require('../models/Rooms');
const response = require('../../responses');

module.exports = {
  CreateBooking: async (req, res) => {
    try {
      const userId = req.user.id;
      let {
        roomId,
        bedCountBooked,
        totalAmount,
        roomPriceAtBooking,
        visitDate,
      } = req.body;

      // ✅ Ensure number
      bedCountBooked = Number(bedCountBooked);

      if (!bedCountBooked || bedCountBooked <= 0) {
        return response.error(res, 'Invalid bed count');
      }

      // ✅ ATOMIC: check + deduct beds
      const roomData = await Rooms.findOneAndUpdate(
        {
          _id: roomId,
          availableBeds: { $gte: bedCountBooked },
        },
        {
          $inc: { availableBeds: -bedCountBooked },
        },
        { new: true },
      );

      if (!roomData) {
        return response.error(res, 'Not enough beds available');
      }

      // ✅ Create booking AFTER bed lock
      const booking = await Booking.create({
        roomId,
        user: userId,
        owner: roomData.owner,
        bedCountBooked,
        totalAmount,
        roomPriceAtBooking,
        visitDate,
        status: 'requested',
      });

      return response.ok(res, 'Booking request created', booking);
    } catch (err) {
      console.error('CreateBooking Error:', err);
      return response.error(res, err.message);
    }
  },

  
  AdminGetAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('room', 'propertyName pricePerMonth');
      return response.success(res, 'All bookings fetched', bookings);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

 
  AdminGetBookingDetails: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findById(bookingId)
        .populate('user', 'name email')
        .populate('owner', 'name email')
        .populate('room');

      if (!booking) return response.notFound(res, 'Booking not found');

      return response.success(res, 'Booking details fetched', booking);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 4️⃣ Customer → Get My Bookings
  GetCustomerBookings: async (req, res) => {
    try {
      const userId = req.user._id;

      const bookings = await Booking.find({ user: userId }).populate(
        'room',
        'propertyName pricePerMonth images',
      );

      return response.success(res, 'Customer bookings fetched', bookings);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 5️⃣ Owner → Bookings for My Rooms
  OwnerGetBookings: async (req, res) => {
    try {
      const ownerId = req.user._id;

      const bookings = await Booking.find({ owner: ownerId })
        .populate('room', 'propertyName')
        .populate('user', 'name email');

      return response.success(res, 'Owner bookings fetched', bookings);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 6️⃣ Owner → Approve Booking (allow visit)
  ApproveBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'approved' },
        { new: true },
      );

      return response.success(res, 'Booking approved', booking);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 7️⃣ Owner → Mark Visit Done
  MarkVisited: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'visited' },
        { new: true },
      );

      return response.success(res, 'Visit marked completed', booking);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 8️⃣ Customer → Confirm for Payment
  ReadyForPayment: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'pending_payment' },
        { new: true },
      );

      return response.success(res, 'Proceed to payment', booking);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 9️⃣ After successful payment
  PaymentDone: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { paymentId } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) return response.notFound(res, 'Booking not found');

      booking.status = 'paid';
      booking.paymentId = paymentId;
      await booking.save();

      await Rooms.findByIdAndUpdate(booking.room, {
        $inc: { availableBeds: -booking.bedCountBooked },
      });

      return response.success(
        res,
        'Booking confirmed & payment successful',
        booking,
      );
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 🔟 Cancel Booking (customer/admin/owner)
  CancelBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'cancelled', cancellationReason: reason },
        { new: true },
      );

      return response.success(res, 'Booking cancelled', booking);
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
