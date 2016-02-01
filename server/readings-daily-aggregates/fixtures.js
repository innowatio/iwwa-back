function getTime (day, monthIndex) {
    return moment.utc().subtract(monthIndex, "month").date(day).format("YYYY-MM-DD");
}

function getMeasurementsTypes (sensorId) {
    if (sensorId.indexOf("ANZ") >= 0 || sensorId.indexOf("IT") >= 0) {
        return ["activeEnergy", "reactiveEnergy", "maxPower"];
    } else if (sensorId.indexOf("ZTHL") >= 0) {
        return ["temperature", "humidity", "illuminance"];
    } else if (sensorId.indexOf("COOV") >= 0) {
        return ["co2"];
    } else {
        return ["activeEnergy", "reactiveEnergy", "maxPower"];
    }
}

function getUnitOfMeasurement (measurementType) {
    switch (measurementType) {
    case "activeEnergy":
        return "kWh";
    case "reactiveEnergy":
        return "kVArh";
    case "maxPower":
        return "VAr";
    case "temperature":
        return "°C";
    case "humidity":
        return "%";
    case "illuminance":
        return "Lux";
    case "co2":
        return "ppm";
    }
}

function getRandomArbitrary(min, max, source) {
    if (!min || !max) {
        return "";
    }
    var value = Math.random() * (max - min) + min;
    if (source === "forecast") {
        value += 5;
    }
    return value.toFixed(2);
}

function createMeasurementValues (measurements, sensorId, source, measurementType) {
    const lengthOfTheArray = 12*24;
    var array = [];
    const measurementsString = measurements[measurementType];
    const measurementsArray = measurementsString.split(",");
    for (var i=0; i<lengthOfTheArray; i++) {
        const measurementsValue = parseFloat(measurementsArray[i]);
        const max = (measurementsValue + (measurementsValue*2/100));
        const min = (measurementsValue - (measurementsValue*2/100));
        array.push(getRandomArbitrary(max, min, source));
    }
    return array.join(",");
}

function insertDataFromJSON (path, sensorsIds, source) {
    const numberOfMonth = 2
    const data = JSON.parse(Assets.getText(path));
    sensorsIds.map(sensorId => {
        for (var monthIdx=0; monthIdx<numberOfMonth; monthIdx++) {
            for (var dayOfMonth=1; dayOfMonth<=moment().subtract(monthIdx, "month").daysInMonth(); dayOfMonth++) {
                const day = getTime(dayOfMonth, monthIdx);
                const measurementsTypes = getMeasurementsTypes(sensorId);
                measurementsTypes.forEach(measurementType => {
                    ReadingsDailyAggregates.insert({
                        _id: `${sensorId}-${day}-${source}-${measurementType}`,
                        sensorId,
                        day,
                        source,
                        measurementType,
                        measurementValues: createMeasurementValues(data.measurements, sensorId, source, measurementType),
                        measurementsDeltaInMs: 300000,
                        unitOfMeasurement: getUnitOfMeasurement(measurementType)
                    });
                });
            }
        };
    });

}

/*
*   Expected structure of the db:
*   {
*       _id: "sensorId-day-source-measurementType",
*       day = "YYYY-MM-DD",
*       sensorId = "sensorId",
*       source: ["reading", "forecast"],
*       measurementType = "",
*       measurementsDeltaInMs = 300000,
*       measurementValues: "",
*       unitOfMeasurement: ""
*   }
*/

function getAlarms (sensorId) {
    const alarms = [];
    for (i=0; i<28; i++) {
        const date = parseInt(moment().startOf("month").subtract(1, "month").add({day: i, hour: 12}).valueOf())
        const alarm = {
            _id: `${sensorId}-${date}`,
            date
        };
        alarms.push(alarm)
    }
    return alarms;
}
Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        ReadingsDailyAggregates.find().count() === 0
    ) {
        const path = "fixtures/readings-daily-aggregates";
        const listOfSensorIdInSiteTest1 = ["SitoDiTest1", "IT001", "ANZ01", "IT002", "ANZ02", "ZTHL01", "ZTHL02",
            "ZTHL03", "ZTHL04", "COOV01", "COOV02"];
        const listOfSensorIdInSiteTest2 = ["SitoDiTest2", "IT003", "ANZ03", "IT004", "ANZ04", "ANZ05", "ANZ06",
            "ZTHL05", "ZTHL06", "ZTHL07", "ZTHL08", "ZTHL09", "ZTHL10", "ZTHL11",
            "COOV03", "COOV04", "COOV05"];
        const allowedSource = ["reading", "forecast"];

        // FIXTURES FOR CHARTS
        allowedSource.map(source => {
            insertDataFromJSON(`${path}/test-sites-value.json`, listOfSensorIdInSiteTest1, source);
            insertDataFromJSON(`${path}/test-sites-value.json`, listOfSensorIdInSiteTest2, source);
        });

        // FIXTURES FOR ALARMS
        ["SitoDiTest1", "SitoDiTest2", "IT001", "ANZ01", "IT002", "ANZ02", "IT003", "ANZ03", "IT004", "ANZ04", "ANZ05", "ANZ06"].map(sensorId => {
            Alarms.insert({
                podId: sensorId,
                name: sensorId,
                active: true,
                notifications: getAlarms(sensorId)
            })
        });

    }
});
