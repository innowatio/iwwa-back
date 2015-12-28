Meteor.publish("misureBySitoAndMonth", function (siteId, month) {
    check(siteId, String);
    check(month, String);
    return SiteMonthReadingsAggregates.find({
        siteId,
        month
    });
});
