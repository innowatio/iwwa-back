Meteor.publish("dailyMeasuresBySensor", (sensorId, dateStart, dateEnd, source, measurementType) => {
    check(sensorId, String);
    check(measurementType, String);
    check(source, String);
    check(dateStart, String);
    check(dateEnd, String);
    return ReadingsDailyAggregates.find({
        sensorId,
        source,
        measurementType,
        day: {
            $gte: dateStart,
            $lte: dateEnd
        }
    })
});
