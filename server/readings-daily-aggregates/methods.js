import {daysInInterval} from "../publications-commons";

function getIds(sensorId, measurementTypes, dateStart, dateEnd) {
    return measurementTypes.map(measurementType => {
        return daysInInterval(dateStart, dateEnd).map(day => `${sensorId}-${day}-reading-${measurementType}`);
    });
}

Meteor.methods({
    getDailyAggregatesByRange: (sensorId, dateStart, dateEnd) => {

        const sensor = Sensors.findOne({
            _id: sensorId
        });

        if (sensor) {
            const measurementTypes = sensor.measurementTypes || [];

            const result = ReadingsDailyAggregates.find({
                _id: {
                    $in: _.flatten(getIds(sensorId, measurementTypes, dateStart, dateEnd))
                }
            }).fetch();

            return result;
        } else {
            return [];
        }
    }
});
