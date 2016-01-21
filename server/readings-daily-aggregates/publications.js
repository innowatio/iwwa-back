Meteor.publish("dailyMeasuresBySensor", (sensorId, dayStart, dayEnd, source, measurementType) => {
    check(sensorId, String);
    check(source, String);
    check(dayStart, String);
    check(dayEnd, String);
    return ReadingsDailyAggregates.find({
        sensorId,
        source,
        measurementType: measurementType.key,
        day: {
            $gte: dayStart,
            $lte: dayEnd
        }
    })
});
