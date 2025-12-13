const router = require("express").Router();
const BookingCtrl = require('@controllers/bookingsControler');
const { authenticate } = require('@middlewares/authMiddleware');


router.post("/Create", authenticate, BookingCtrl.CreateBooking);
router.get("/customer/bookings", authenticate, BookingCtrl.GetCustomerBookings);
router.patch("/booking/:bookingId/payment-ready", authenticate, BookingCtrl.ReadyForPayment);
router.patch("/booking/:bookingId/payment-success", authenticate, BookingCtrl.PaymentDone);
router.patch("/booking/:bookingId/cancel", authenticate, BookingCtrl.CancelBooking);

// Owner
router.get("/owner/bookings", authenticate, BookingCtrl.OwnerGetBookings);
router.patch("/booking/:bookingId/approve", authenticate, BookingCtrl.ApproveBooking);
router.patch("/booking/:bookingId/visited", authenticate, BookingCtrl.MarkVisited);

// Admin
router.get("/admin/bookings", authenticate, BookingCtrl.AdminGetAllBookings);
router.get("/admin/booking/:bookingId", authenticate, BookingCtrl.AdminGetBookingDetails);

module.exports = router;
