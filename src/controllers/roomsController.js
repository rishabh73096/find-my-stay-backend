'use strict';
const Rooms = require('../models/Rooms');
const User = require('../models/User');
const response = require('../../responses');

module.exports = {
  // ➕ Add New Room
  AddRooms: async (req, res) => {
    try {
      const ownerId = req.user?.id;
      const payload = req.body;
      console.log('room', payload);

      payload.owner = ownerId;

      const room = await Rooms.create(payload);
      console.log('room', room);

      return response.ok(res, 'Room Added Successfully', room);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 📌 Get All Rooms (List)
  GetAllRooms: async (req, res) => {
    try {
      let { page = 1, limit = 10 } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      const skip = (page - 1) * limit;

      const totalRooms = await Rooms.countDocuments();

      const rooms = await Rooms.find()
        .populate('owner', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      return response.ok(res, {
        totalPages: Math.ceil(totalRooms / limit),
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalRooms, // optional but useful
        data: rooms,
      });
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  // 🔍 Get Single Room Details
  GetRoomById: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Rooms.findById(roomId).populate('owner',);

      if (!room) return response.notFound(res, 'Room not found');

      return response.ok(res, room);
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
      return response.ok(res, 'Filtered rooms fetched', rooms);
    } catch (err) {
      return response.error(res, err.message);
    }
  },

  UpdateRoom: async (req, res) => {
    try {
      const { editId } = req.params;
      const payload = req.body;
      console.log('payload', payload);

      const room = await Rooms.findByIdAndUpdate(editId, payload, {
        new: true,
      });
      console.log('room', room);

      if (!room) return response.notFound(res, 'Room not found');

      return response.ok(res, 'update sucessfully', room);
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

      return response.ok(res, 'Room deleted successfully', room);
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
