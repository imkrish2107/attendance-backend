// backend_node/utils/dbCleanup.js

const mongoose = require("mongoose");
const TravelRequest = require("../models/TravelRequest");
const Attendance = require("../models/Attendance");
const LocationLog = require("../models/LocationLog");
const AttendanceEvent = require("../models/AttendanceEvent");

async function fixBrokenIndexes() {
  try {
    console.log("🔧 Checking & fixing broken indexes...");

    const collections = [
      "attendances",
      "attendanceevents",
      "locationlogs",
      "travelrequests"
    ];

    for (const name of collections) {
      const indexes = await mongoose.connection.db.collection(name).indexes();

      for (const idx of indexes) {
        if (idx.name === "id_1") {
          console.log(`⚠️ Found broken index in ${name}: id_1 — Removing...`);
          await mongoose.connection.db.collection(name).dropIndex("id_1");
        }
      }
    }

    console.log("✅ Index check complete");
  } catch (err) {
    console.log("❌ Error fixing indexes:", err.message);
  }
}

/* =====================================
   INVALID DATA CLEANERS
   ===================================== */

async function cleanTravelRequests() {
  const deleted = await TravelRequest.deleteMany({
    $or: [
      { reason: null },
      { reason: "" },
      { reason: { $exists: false } }
    ]
  });
  console.log(`🗑 TravelRequest cleanup: removed ${deleted.deletedCount} invalid records`);
}

async function cleanAttendance() {
  const deleted = await Attendance.deleteMany({
    $or: [
      { userId: null },
      { date: null }
    ]
  });
  console.log(`🗑 Attendance cleanup: removed ${deleted.deletedCount} invalid records`);
}

async function cleanLocationLog() {
  const deleted = await LocationLog.deleteMany({
    $or: [
      { latitude: null },
      { longitude: null },
      { userId: null }
    ]
  });
  console.log(`🗑 LocationLog cleanup: removed ${deleted.deletedCount} invalid logs`);
}

async function cleanAttendanceEvent() {
  const deleted = await AttendanceEvent.deleteMany({
    $or: [
      { userId: null },
      { type: null },
      { timestamp: null }
    ]
  });
  console.log(`🗑 AttendanceEvent cleanup: removed ${deleted.deletedCount} invalid events`);
}

/* =====================================
   30 DAY AUTO DELETE
   ===================================== */

async function purgeOldLogs() {
  const limit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const loc = await LocationLog.deleteMany({ timestamp: { $lt: limit } });
  const events = await AttendanceEvent.deleteMany({ timestamp: { $lt: limit } });

  console.log(`🧹 Auto purge: ${loc.deletedCount} locations, ${events.deletedCount} events older than 30 days`);
}

/* =====================================
   MAIN CLEAN FUNCTION
   ===================================== */

async function fullDatabaseCleanup() {
  console.log("\n⚠️  STARTING FULL DATABASE CLEANUP...");

  await fixBrokenIndexes();
  await cleanTravelRequests();
  await cleanAttendance();
  await cleanLocationLog();
  await cleanAttendanceEvent();
  await purgeOldLogs();

  console.log("✅ FULL DATABASE CLEANUP COMPLETED\n");
}

module.exports = fullDatabaseCleanup;
