Meteor.publish("readingsRealTimeAggregatesBySite", (siteId) => {

    const site = Sites.findOne({
        _id: siteId
    })

    return ReadingsRealTimeAggregates.find({
        sensorId: {
            $in: site.sensorsIds
        }
    });
});
