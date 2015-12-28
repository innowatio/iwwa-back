Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        ReadingsRealTimeAggregates.find().count() === 0
    ) {
        const path = "fixtures/readings-real-time-aggregates";
        ReadingsRealTimeAggregates.insert(JSON.parse(Assets.getText(`${path}/test-sites-1.json`)));
        ReadingsRealTimeAggregates.insert(JSON.parse(Assets.getText(`${path}/test-sites-2.json`)));
    }
});
