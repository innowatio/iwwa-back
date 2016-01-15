Meteor.publish("dailyMeasuresBySensor", (sensorId, source, dayStart, dayEnd) => {
    check(sensorId, String);
    check(source, String);
    check(dayStart, String);
    check(dayEnd, String);
    return ReadingsDailyAggregates.find({
        sensorId,
        source,
        day: {
            $gte: dayStart,
            $lte: dayEnd
        }
    })
});
