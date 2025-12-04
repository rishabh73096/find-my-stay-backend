const express = require('express');
const RoomCtrl = require('@controllers/roomsController');
const { authenticate } = require('@middlewares/authMiddleware');

const router = express.Router();

router.post('/room', authenticate, RoomCtrl.AddRooms);
router.get('/rooms', RoomCtrl.GetAllRooms);
router.get('/room/:roomId', RoomCtrl.GetRoomById);
router.get('/filter/rooms', RoomCtrl.GetRoomsByFilter);
router.put('/room/:roomId', authenticate, RoomCtrl.UpdateRoom);
router.delete('/room/:roomId', authenticate, RoomCtrl.DeleteRoom);

router.patch(
  '/room/:roomId/update-beds',
  authenticate,
  RoomCtrl.UpdateBedsAfterBooking,
);

module.exports = router;
