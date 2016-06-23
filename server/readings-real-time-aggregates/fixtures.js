Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        ReadingsRealTimeAggregates.find().count() === 0
    ) {
        const path = "fixtures/readings-real-time-aggregates";
        const json = JSON.parse(Assets.getText(`${path}/test-realtime-aggregates.json`));
        json.map(realtime => {
            ReadingsRealTimeAggregates.insert(realtime);
        })
    }
});
