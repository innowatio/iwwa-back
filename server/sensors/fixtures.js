Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Sensors.find().count() === 0
    ) {
        JSON.parse(Assets.getText("fixtures/sensors/test-sensors.json")).map((sensor) => {
            Sensors.insert(sensor);
        });
    }
});
