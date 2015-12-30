function getTime (day) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getYear() + 1900;
    return `${year}-${month}-${day}`;
}

function getRandomArbitrary(min, max) {
    if (!min || !max) {
        return "";
    }
    const value = Math.random() * (max - min) + min;
    return value.toFixed(2);
}

function createData (data, value) {
    const lengthOfTheArray = 12*24;
    var objectKeys = [];
    if (value.slice(0,3) === "ANZ" || value.slice(0,2) === "IT") {
        objectKeys = ["activeEnergy", "reactiveEnergy", "maxPower"];
    } else if (value.slice(0,4) === "ZTHL") {
        objectKeys = ["temperature", "humidity", "illuminance"];
    } else if (value.slice(0,4) === "COOV") {
        objectKeys = ["co2"];
    }
    return objectKeys.reduce((prev, value) => {
        var array = [];
        for (var i=0; i<=lengthOfTheArray; i++) {
            const dataValue = data[value][i];
            const max = parseFloat(dataValue + dataValue*10/100);
            const min = parseFloat(dataValue - dataValue*10/100);
            array.push(getRandomArbitrary(max, min));
        }
        prev[value] = array.toString();
        return prev;
    }, {})
}

function insertDataFromJSON (path, sensorName) {
    const monthLength = 30;
    var data = JSON.parse(Assets.getText(path));
    sensorName.map(value => {
        for (var i=1; i<=monthLength; i++) {
            var result = {};
            result.measurements = createData(data.measurements, value);
            result.sensorId = value;
            result._id = `${value}-${getTime(i)}`;
            result.day = getTime(i);
            SensorsDailyReadingsAggregates.insert(result);
        }
    });

}

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        SensorsDailyReadingsAggregates.find().count() === 0
    ) {
        const path = "fixtures/sensors-daily-readings-aggregates";
        const sensorTest1 = ["IT001", "ANZ01", "IT002", "ANZ02", "ZTHL01", "ZTHL02",
            "ZTHL03", "ZTHL04", "COOV01", "COOV02"];
        insertDataFromJSON(`${path}/test-sites-value.json`, sensorTest1);

        const sensorTest2 = ["IT003", "ANZ03", "IT004", "ANZ04", "ANZ05", "ANZ06",
            "ZTHL05", "ZTHL06", "ZTHL07", "ZTHL08", "ZTHL09", "ZTHL10", "ZTHL11",
            "COOV03", "COOV04", "COOV05"];
        insertDataFromJSON(`${path}/test-sites-value.json`, sensorTest2);
    }
});
