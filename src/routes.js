const authRoutes = require('../src/routes/authRoutes');
const contact = require("../src/routes/contactRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use("/contact", contact)

};
