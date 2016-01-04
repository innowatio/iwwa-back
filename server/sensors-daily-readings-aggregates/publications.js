Meteor.publish("dailyMeasuresBySensor", (sensorId, dayStart, dayEnd) => {
    check(sensorId, String);
    check(dayStart, String);
    check(dayEnd, String);
    return SensorsDailyReadingsAggregates.find({
        sensorId,
        day: {
            $gte: dayStart,
            $lte: dayEnd
        }
    })
});
