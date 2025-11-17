const express = require('express');
const ContactUs = require('@controllers/ContactusController');
const { authenticate } = require('@middlewares/authMiddleware');

const router = express.Router();
router.post("/createFeedback", authenticate, ContactUs.createFeedback);
router.post(
    "/getAllFeedback",
    authenticate,
    ContactUs.getAllFeedback
);
router.post("/updateContactStatus", authenticate, ContactUs.updateStatus);

module.exports = router;
