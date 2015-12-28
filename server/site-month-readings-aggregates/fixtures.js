function getTime () {
    const month = new Date().getMonth() + 1;
    const year = new Date().getYear() + 1900;
    return `${year}-${month}`;
}

function insertDataFromJSON (path) {
    var data = JSON.parse(Assets.getText(path));
    data._id = `${data.siteId}-${getTime()}`;
    data.month = getTime();
    SiteMonthReadingsAggregates.insert(data);
}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        SiteMonthReadingsAggregates.find().count() === 0
    ) {
        const path = "fixtures/site-month-readings-aggregates";
        insertDataFromJSON(`${path}/test-sites-1.json`);
        insertDataFromJSON(`${path}/test-sites-2.json`);
    }
});
