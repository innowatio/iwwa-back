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

function insertReadingFromJSON () {
    const TYPES = "activeEnergy";
    const SOURCE = "reading";
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

            datas = buildYearlyConsumptionReading(SITES_APP[sensorId], actualYear, values, SOURCE, TYPES);
            ConsumptionsYearlyAggregates.insert(datas);
        }
    }
}

function insertReferenceFromJSON () {
    const TYPES = "activeEnergy";
    const SOURCE = "reference";
    const SITES = ["SitoDiTest1", "SitoDiTest2"];

    for (var sensorId in SITES) {
        var values = [];
        const actualYear = moment();
        const daysInYear = moment([actualYear.year() + 1]).diff(moment([actualYear.year()]), "days", true);
        for(var dayIndex = 1; dayIndex <= daysInYear; dayIndex++) {
            const momentDay = moment(`${actualYear}-${dayIndex}`, "YYYY-DDD");
            values[dayIndex -1] = parseFloat(generateRandomDailyConsumption(momentDay).toFixed(2));
        }
        datas = buildYearlyConsumptionReading(SITES[sensorId], actualYear, values, SOURCE, TYPES);
        ConsumptionsYearlyAggregates.insert(datas);
    }
}

function insertComfortFromJSON () {
    const TYPES = "comfort";
    const SOURCE = "reading";
    const SITES = ["SitoDiTest1", "SitoDiTest2"];

    for (var sensorId in SITES) {
        var values = [];
        const actualYear = moment();
        const daysInYear = moment([actualYear.year() + 1]).diff(moment([actualYear.year()]), "days", true);
        for(var dayIndex = 1; dayIndex <= daysInYear; dayIndex++) {
            const momentDay = moment(`${actualYear}-${dayIndex}`, "YYYY-DDD");
            values[dayIndex -1] = parseFloat(generateRandomComfort(momentDay).toFixed(2));
        }
        datas = buildYearlyConsumptionReading(SITES[sensorId], actualYear, values, SOURCE, TYPES);
        ConsumptionsYearlyAggregates.insert(datas);
    }
}

function buildYearlyConsumptionReading (sensorId, actualYear, values, source, type) {
    const year = actualYear.format("YYYY");
    const uom = type == "activeEnergy" ? "kwh" : "status";
    return {
        _id: `${sensorId}-${year}-${source}-${type}`,
        year: year,
        sensorId: sensorId,
        source: source,
        measurementType: type,
        measurementValues: values.join(","),
        unitOfMeasurement: uom
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

function generateRandomComfort (day) {
    const N_CONF_READING = 24 // numbers of readings in a day
    return Math.floor(Math.random() * (N_CONF_READING*2))
}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        ConsumptionsYearlyAggregates.find().count() === 0
    ) {
        insertReadingFromJSON();
        insertReferenceFromJSON();
        insertComfortFromJSON();
    }
});
