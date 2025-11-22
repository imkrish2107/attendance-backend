// backend_node/utils/cleanupInvalidTravelRequests.js

const TravelRequest = require("../models/TravelRequest");

async function cleanupInvalidTravelRequests() {
  try {
    console.log("🧹 Cleaning invalid TravelRequest documents...");

    const deletedMissing = await TravelRequest.deleteMany({
      reason: { $exists: false }
    });

    const deletedNull = await TravelRequest.deleteMany({
      reason: null
    });

    const deletedEmpty = await TravelRequest.deleteMany({
      reason: ""
    });

    const total =
      deletedMissing.deletedCount +
      deletedNull.deletedCount +
      deletedEmpty.deletedCount;

    console.log(`🧼 Cleanup complete. Removed ${total} invalid records.`);
  } catch (err) {
    console.error("❌ Failed to clean invalid travel requests:", err.message);
  }
}

module.exports = cleanupInvalidTravelRequests;
