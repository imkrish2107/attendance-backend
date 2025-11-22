require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------
// ROUTES (MAIN MODULES)
// ---------------------------

// AUTH
app.use("/api/auth", require("./routes/auth"));

// ATTENDANCE (checkin/checkout/events)
app.use("/api/attendance", require("./routes/attendance"));

// LOCATION tracking + latest location endpoints
app.use("/api/location", require("./routes/location"));

// TRAVEL (request, approve, end, path, history)
app.use("/api/travel", require("./routes/travel"));

// APPROVAL (HR travel approvals if separate)
app.use("/api/approval", require("./routes/approval"));


// ---------------------------
// HR MODULE
// ---------------------------

// HR Dashboard: active status, etc.
app.use("/api/hr", require("./routes/hr"));  // ⭐ NEW


// Attendance admin section
app.use("/api/attendance/admin", require("./routes/attendanceAdmin"));

// Attendance request approval (if exists)
app.use("/api/attendance/requests", require("./routes/requests"));


// ---------------------------
// DATABASE CONNECT + CLEANUP
// ---------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // FULL DATABASE CLEANUP SYSTEM ON STARTUP
    const fullDatabaseCleanup = require("./utils/dbCleanup");
    await fullDatabaseCleanup();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });


// ---------------------------
// DAILY CRON CLEANUP (12 AM)
// ---------------------------

cron.schedule("0 0 * * *", async () => {
  console.log("⏳ Running scheduled daily DB cleanup...");
  const fullDatabaseCleanup = require("./utils/dbCleanup");
  await fullDatabaseCleanup();
});


// ---------------------------
// START SERVER
// ---------------------------

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
