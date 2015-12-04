function randomValue () {
    const value = [];
    const lengthOfTheArray = 30*24*12;
    for (var i=0; i <= lengthOfTheArray ; i++) {
        value.push((Math.random() * 10).tofixed(1))
    }
    return value.join(",");
}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        SiteMonthReadingsAggregates.find().count() === 0
    ) {
        SiteMonthReadingsAggregates.insert({
            podId: "podId",
            month: "2015-10",
            readings: {
                "energia attiva": randomValue(),
                "enregia reattiva": randomValue(),
                "potenza massima": randomValue(),
                "temperature": randomValue(),
                "humidity": randomValue(),
                "illuminance": randomValue(),
                "co2": randomValue()
            }
        });
    }
});
