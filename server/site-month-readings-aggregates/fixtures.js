function getTime () {
    const month = new Date().getMonth() + 1;
    const year = new Date().getYear() + 1900;
    return `${year}-${month}`;
}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        SiteMonthReadingsAggregates.find().count() === 0
    ) {
        var test1 = JSON.parse(
            Assets.getText("fixtures/site-month-readings-aggregates/test-sites-1.json")
        );
        var test2 = JSON.parse(
            Assets.getText("fixtures/site-month-readings-aggregates/test-sites-2.json")
        );

        test1._id = `${test1.siteId}-${getTime()}`
        test1.month = getTime();
        test2._id = `${test2.siteId}-${getTime()}`
        test2.month = getTime();

        SiteMonthReadingsAggregates.insert(test1);
        SiteMonthReadingsAggregates.insert(test2);
    }
});
