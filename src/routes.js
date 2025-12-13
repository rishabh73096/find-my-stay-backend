const authRoutes = require('../src/routes/authRoutes');
const contact = require("../src/routes/contactRoutes");
const roomsRoutes = require('../src/routes/roomsRoutes');
const bookingRoutes = require("../src/routes/bookingroutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use("/contact", contact)
  app.use('/rooms', roomsRoutes);
  app.use("/booking", bookingRoutes)
  
};
