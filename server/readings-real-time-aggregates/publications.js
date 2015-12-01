Meteor.publish("readingsRealTimeAggregatesBySite", function (siteId) {
    return ReadingsRealTimeAggregates.find({siteId});
});
