/*
*   DB structure:
*   {
*       _id: "sensorId-year-source-measurementType",
*       year = "YYYY",
*       sensorId = "sensorId",
*       source: ["reading"],
*       measurementType = ["activeEnergy"],
*       measurementValues: "",
*       unitOfMeasurement: ""
*   }
*/

function insertDataFromJSON () {
    const TYPES = ["activeEnergy"];
    const SOURCES = ["reading"];
    const SITES = ["SitoDiTest1", "SitoDiTest2"];
    const SITES_APP = SITES.reduce((prev, current) => {
        return [...prev, current, `${current}-daily-avg`, `${current}-peers-avg`];
    }, [])
    const YEARS_RANGE = 2;

    for (var sensorId in SITES_APP) {
        for (var year = 0; year < YEARS_RANGE; year++) {
            var values = [];
            const actualYear = moment().subtract(year, "year");
            const daysInYear = moment([actualYear.year() + 1]).diff(moment([actualYear.year()]), "days", true);
            for(var dayIndex = 1; dayIndex <= daysInYear; dayIndex++) {
                const momentDay = moment(`${actualYear}-${dayIndex}`, "YYYY-DDD");
                values[dayIndex -1] = parseFloat(generateRandomDailyConsumption(momentDay).toFixed(2));
            }
            datas = buildYearlyConsumption(SITES_APP[sensorId], actualYear, values);
            ConsumptionsYearlyAggregates.insert(datas);
        }
    }
}

function buildYearlyConsumption (sensorId, actualYear, values) {
    const year = actualYear.format("YYYY");
    return {
        _id: `${sensorId}-${year}-reading-activeEnergy`,
        year: year,
        sensorId: sensorId,
        source: "reading",
        measurementType: "activeEnergy",
        measurementValues: values.join(","),
        unitOfMeasurement: "kWh"
    };
}

function generateRandomDailyConsumption (day) {
    const CONSUMPTION = 1000;

    const randomize = function () {
        const rand = (Math.random() * 200) - 100;
        return CONSUMPTION + rand;
    }

    // week ends
    if (day.weekday() <= 1) {
        return randomize() / 5;
    } else {
        return randomize();
    }
}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        ConsumptionsYearlyAggregates.find().count() === 0
    ) {
        insertDataFromJSON();
    }
});
