'use strict';
const Rooms = require('../models/Rooms');
const User = require('../models/User');
const response = require('../../responses');

module.exports = {
  // ➕ Add New Room
  AddRooms: async (req, res) => {
    try {
      const ownerId = req.user?._id; // JWT me user ka id hona chahiye
      const payload = req.body;

      payload.owner = ownerId;

      const room = await Rooms.create(payload);
      return response.success(res, 'Room Added Successfully', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 📌 Get All Rooms (List)
  GetAllRooms: async (req, res) => {
    try {
      const rooms = await Rooms.find({ isAvailable: true }).populate(
        'owner',
        'name email',
      );
      return response.success(res, 'Room list fetched', rooms);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 🔍 Get Single Room Details
  GetRoomById: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Rooms.findById(roomId).populate('owner', 'name email');

      if (!room) return response.notFound(res, 'Room not found');

      return response.success(res, 'Room details fetched', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 🔍 Filter Rooms by City or Gender
  GetRoomsByFilter: async (req, res) => {
    try {
      const { city, genderAllowed } = req.query;

      let filter = {};
      if (city) filter['address.city'] = new RegExp(city, 'i');
      if (genderAllowed) filter.genderAllowed = genderAllowed;

      const rooms = await Rooms.find(filter);
      return response.success(res, 'Filtered rooms fetched', rooms);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // ✏ Update Room
  UpdateRoom: async (req, res) => {
    try {
      const { roomId } = req.params;
      const payload = req.body;

      const room = await Rooms.findByIdAndUpdate(roomId, payload, {
        new: true,
      });
      if (!room) return response.notFound(res, 'Room not found');

      return response.success(res, 'Room updated', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // ❌ Delete Room
  DeleteRoom: async (req, res) => {
    try {
      const { roomId } = req.params;

      const room = await Rooms.findByIdAndDelete(roomId);
      if (!room) return response.notFound(res, 'Room not found');

      return response.success(res, 'Room deleted successfully', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 🔄 Update Available Beds After Booking
  UpdateBedsAfterBooking: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { bookedBeds } = req.body;

      const room = await Rooms.findById(roomId);
      if (!room) return response.notFound(res, 'Room not found');

      if (room.availableBeds < bookedBeds)
        return response.error(res, 'Not enough beds available');

      room.availableBeds -= bookedBeds;
      await room.save();

      return response.success(res, 'Bed count updated', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },
};
