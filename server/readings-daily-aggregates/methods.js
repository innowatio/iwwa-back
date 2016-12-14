import {daysInInterval} from "../publications-commons";

function getIds(sensorId, measurementsType, dateStart, dateEnd) {
    return measurementsType.map(measurementType => {
        return daysInInterval(dateStart, dateEnd).map(day => `${sensorId}-${day}-reading-${measurementType}`);
    });
}

Meteor.methods({
    getDailyAggregatesByRange: (sensorId, dateStart, dateEnd) => {

        const sensor = Sensors.findOne({
            _id: sensorId
        });

        if (sensor) {
            const measurementsType = sensor.measurementsType || [];

            const result = ReadingsDailyAggregates.find({
                _id: {
                    $in: _.flatten(getIds(sensorId, measurementsType, dateStart, dateEnd))
                }
            }).fetch();

            return result;
        } else {
            return [];
        }
    }
});
