// utils/timeCalculator.js

function pairEvents(events) {
  const pairs = [];
  let checkin = null;

  for (let ev of events) {
    if (ev.type === "checkin") {
      checkin = ev.timestamp;
    } else if (ev.type === "checkout" && checkin) {
      pairs.push({
        enter: new Date(checkin),
        exit: new Date(ev.timestamp),
        locationId: ev.locationId || null
      });
      checkin = null;
    }
  }

  return pairs;
}

function msToHours(ms) {
  let h = ms / (1000 * 60 * 60);

  // OPTION D: minimum 0.02 hours for any positive time
  if (ms > 0 && h < 0.02) h = 0.02;

  return Number(h.toFixed(2));
}

module.exports.calculate = (attendanceEvents, travelEvents) => {
  let officeMs = 0;
  let travelMs = 0;

  const pairs = pairEvents(attendanceEvents);

  // OFFICE HOURS
  for (let p of pairs) {
    const diff = p.exit - p.enter;
    if (p.locationId) officeMs += diff;
  }

  // TRAVEL HOURS
  for (let t of travelEvents) {
    if (t.status === "approved" && t.startTime && t.endTime) {
      travelMs += (new Date(t.endTime) - new Date(t.startTime));
    }
  }

  const totalMs = officeMs + travelMs;

  return {
    officeHours: msToHours(officeMs),
    travelHours: msToHours(travelMs),
    totalHours: msToHours(totalMs),
    metTarget: totalMs >= 10 * 60 * 60 * 1000
  };
};
