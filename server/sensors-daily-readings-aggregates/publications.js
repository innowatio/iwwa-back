Meteor.publish("dailyMeasuresBySensor", (sensorId, dayStart, dayEnd) => {
    check(sensorId, String);
    check(dayStart, String);
    check(dayEnd, String);
    return ReadingsDailyAggregates.find({
        sensorId,
        day: {
            $gte: dayStart,
            $lte: dayEnd
        }
    })
});
