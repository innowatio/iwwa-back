Meteor.publish("findRealTimeMeasuresBySite", function (siteId) {
    return RealTimeMeasures.find({"siteId" : siteId});
});
