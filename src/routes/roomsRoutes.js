const express = require('express');
const RoomCtrl = require('@controllers/roomsController');
const { authenticate } = require('@middlewares/authMiddleware');

const router = express.Router();

router.post('/add', authenticate, RoomCtrl.AddRooms);
router.get('/getAll', RoomCtrl.GetAllRooms);
router.get('/getRoom/:roomId', RoomCtrl.GetRoomById);
router.get('/filter/rooms', RoomCtrl.GetRoomsByFilter);
router.post('/update/:editId', authenticate, RoomCtrl.UpdateRoom);
router.delete('/delete/:roomId', authenticate, RoomCtrl.DeleteRoom);

router.patch(
  '/room/:roomId/update-beds',
  authenticate,
  RoomCtrl.UpdateBedsAfterBooking,
);

module.exports = router;
