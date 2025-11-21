// services/attendanceCalculator.js

function pairEvents(events) {
    const pairs = [];
    let currentCheckIn = null;

    for (let ev of events) {
        if (ev.type === "checkin") {
            currentCheckIn = ev.timestamp;
        } else if (ev.type === "checkout" && currentCheckIn) {
            pairs.push({
                enter: new Date(currentCheckIn),
                exit: new Date(ev.timestamp),
                locationId: ev.locationId || null
            });
            currentCheckIn = null;
        }
    }

    return pairs;
}

function msToHours(ms) {
    let h = ms / (1000 * 60 * 60);

    // OPTION D: minimum 0.02 hours if ANY work happened
    if (ms > 0 && h < 0.02) {
        h = 0.02;
    }

    return Number(h.toFixed(2));
}

module.exports.calculate = (attendanceEvents, travelEvents) => {
    // Pair check-in + checkout
    const pairs = pairEvents(attendanceEvents);

    let officeMs = 0;
    let travelMs = 0;

    // OFFICE TIME
    for (let p of pairs) {
        const diff = p.exit - p.enter;
        if (p.locationId) {
            officeMs += diff;
        }
    }

    // TRAVEL TIME (approved only)
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
