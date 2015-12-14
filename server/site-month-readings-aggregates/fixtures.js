function randomValue () {
    const value = [];
    const lengthOfTheArray = 30*24*12;
    for (var i=0; i <= lengthOfTheArray ; i++) {
        value.push((Math.random() * 10).toFixed(1))
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
            month: moment().format("YYYY-MM"),
            measurements: {
                "activeEnergy": randomValue(),
                "reactiveEnergy": randomValue(),
                "maxPower": randomValue(),
                "temperature": randomValue(),
                "humidity": randomValue(),
                "illuminance": randomValue(),
                "co2": randomValue()
            }
        });
    }
});
