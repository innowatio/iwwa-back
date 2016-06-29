Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production"
    ) {
        ReadingsRealTimeAggregates.remove({});
        const path = "fixtures/readings-real-time-aggregates";
        const json = JSON.parse(Assets.getText(`${path}/test-realtime-aggregates.json`));
        const day = moment().format("YYYY-MM-DD");
        json.map(realtime => {
            ReadingsRealTimeAggregates.insert({
                _id: `${realtime.sensorId}-${day}-reading-${realtime.measurementType}`,
                day: day,
                measurementType : realtime.measurementType,
                measurementValue : realtime.measurementValue,
                measurementTime : realtime.measurementTime,
                unitOfMeasurement : realtime.unitOfMeasurement,
                sensorId : realtime.sensorId
            });
        })
    }
});