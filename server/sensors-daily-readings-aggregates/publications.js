Meteor.publish("dailyMeasuresBySensor", (sensorId, day) => {
    check(sensorId, String);
    check(day, String);
    return SensorsDailyReadingsAggregates.find({
        sensorId,
        day
    })
});
