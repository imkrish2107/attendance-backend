const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// ---------------------------
// ROUTES IMPORTS
// ---------------------------
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const dailyRoutes = require('./routes/daily');
const locationRoutes = require('./routes/location');
const travelRoutes = require('./routes/travel');
const managerRoutes = require('./routes/manager');
const devRoutes = require('./routes/dev');


// ---------------------------
// MONGO CONNECTION
// ---------------------------
const MONGO =
  process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_app';

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo connection error:', err));


// ---------------------------
// ROUTE MOUNTING
// ---------------------------
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendance/daily', dailyRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/dev', devRoutes);


// ---------------------------
// DEFAULT ROUTE
// ---------------------------
app.get('/', (req, res) => {
  res.send('Attendance backend is running');
});


// ---------------------------
// START SERVER (IMPORTANT)
// ---------------------------

// CHANGE THIS to YOUR WiFi IP (from ipconfig)
const HOST = "10.117.112.144";  
const PORT = process.env.PORT || 4000;

// Bind to the WiFi adapter only
app.listen(PORT, HOST, () => {
  console.log(`Backend running at http://${HOST}:${PORT}`);
  console.log(`Accessible on LAN for your phone`);
});
