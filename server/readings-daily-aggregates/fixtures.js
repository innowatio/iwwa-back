function getTime (day, monthIndex) {
    return moment.utc().subtract(monthIndex, "month").date(day).format("YYYY-MM-DD");
}

function getMeasurementsTypes (sensorId) {
    if (sensorId.indexOf("IT-") >= 0) {
        return ["weather-humidity", "weather-cloudeness", "weather-temperature", "weather-id"];
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
    case "weather-humidity":
        return "%";
    case "weather-cloudeness":
        return "%";
    case "weather-temperature":
        return "°C";
    case "weather-id":
        return "id";
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

function createMeasurementValues (measurements, measurementType, source) {
    // weather-id is an id, so it should be fixed to existent integer values.
    if (measurementType.indexOf("weather-id") >= 0) {
        return measurements[measurementType];
    }
    var filteredMeasurements = measurements[measurementType].split(",").filter(x => !isNaN(parseFloat(x)));
    var values = filteredMeasurements.map(x => {
        const measurementsValue = parseFloat(x);
        const max = (measurementsValue + (measurementsValue * 2 / 100));
        const min = (measurementsValue - (measurementsValue * 2 / 100));
        return getRandomArbitrary(max, min, source);
    }).sort();
    return values.join(",");
}

function createMeasurementTimes (measurements, measurementType, date) {
    var dayStart = moment.utc(date).valueOf();
    var dayEnd = moment.utc(date).endOf('day').valueOf();
    if (measurementType.indexOf("weather") >= 0) {
        var timesWeather = [];
        for (var i=1; i<=12; i++) {
            timesWeather.push(moment(dayStart).add({hours: i * 2}).valueOf());
        }
        return timesWeather.join(",");
    }
    var filteredMeasurements = measurements[measurementType].split(",").filter(x => !isNaN(parseFloat(x)));
    var times = filteredMeasurements.map(x => {
        return Math.floor((Math.random() * (dayEnd - dayStart)) + dayStart);
    }).sort();
    return times.join(",");
}

function insertDataFromJSON(path, sensorsIds, source) {
    const numberOfMonth = 2
    const data = JSON.parse(Assets.getText(path));
    sensorsIds.map(sensorId => {
        for (var monthIdx=0; monthIdx<numberOfMonth; monthIdx++) {
            for (var dayOfMonth=1; dayOfMonth<=moment().subtract(monthIdx, "month").daysInMonth(); dayOfMonth++) {
                const date = getTime(dayOfMonth, monthIdx);
                const measurementsTypes = getMeasurementsTypes(sensorId);
                measurementsTypes.forEach(measurementType => {
                    var obj = {
                        _id: `${sensorId}-${date}-${source}-${measurementType}`,
                        sensorId,
                        day: date,
                        source,
                        measurementType,
                        measurementValues: createMeasurementValues(data.measurements, measurementType, source),
                        measurementTimes: createMeasurementTimes(data.measurements, measurementType, date),
                        unitOfMeasurement: getUnitOfMeasurement(measurementType)
                    }
                    if (obj.measurementValues.split(",").length !== obj.measurementTimes.split(",").length) {
                        console.log(`values=${obj.measurementValues.split(",").length} timestamps=${obj.measurementTimes.split(",").length}`);
                        throw Error("Values and timestamps number do not match");
                    }
                    ReadingsDailyAggregates.insert(obj);
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
*       source: "",
*       measurementType = "",
*       measurementValues: "",
*       measurementTimes: "",
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
        const listOfWeatherSensor = ["IT-CO", "IT-SO", "IT-MI", "IT-BG"];
        const allowedSource = ["reading", "forecast"];

        // FIXTURES FOR CHARTS
        allowedSource.map(source => {
            insertDataFromJSON(`${path}/test-sites-value.json`, listOfSensorIdInSiteTest1, source);
            insertDataFromJSON(`${path}/test-sites-value.json`, listOfSensorIdInSiteTest2, source);
            insertDataFromJSON(`${path}/test-sites-value.json`, listOfWeatherSensor, source);
        });

        // FIXTURES FOR ALARMS
        ["SitoDiTest1", "SitoDiTest2", "IT001", "ANZ01", "IT002", "ANZ02", "IT003", "ANZ03", "IT004", "ANZ04", "ANZ05", "ANZ06"].map(sensorId => {
            Alarms.insert({
                podId: sensorId,
                name: sensorId,
                type: "automatic",
                active: true,
                notifications: getAlarms(sensorId)
            })
        });

    }
});
