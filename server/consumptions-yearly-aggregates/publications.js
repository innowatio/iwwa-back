function getId (sensorId, year, source, measurementType) {
    return `${sensorId}-${year}-${source}-${measurementType}`;
}

Meteor.publish("yearlyConsumptions", (sensorId, year, source, measurementType) => {
    check(sensorId, String);
    check(year, String);
    check(source, String);
    check(measurementType, String);

    return ConsumptionsYearlyAggregates.find({
        _id: getId(sensorId, year, source, measurementType)
    });
});
