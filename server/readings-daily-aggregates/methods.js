import {daysInIntervalUtc} from "../publications-commons";

function getIds(sensorId, measurementTypes, dateStart, dateEnd, utcOffset) {
    return measurementTypes.map(measurementType => {
        return daysInIntervalUtc(dateStart, dateEnd, utcOffset).map(day => `${sensorId}-${day}-reading-${measurementType}`);
    });
}

Meteor.methods({
    getDailyAggregatesByRange: (sensorId, dateStart, dateEnd, utcOffset) => {
        const sensor = Sensors.findOne({
            _id: sensorId
        });

        if (sensor) {
            const measurementTypes = sensor.measurementTypes || [];
            const result = ReadingsDailyAggregates.find({
                _id: {
                    $in: _.flatten(getIds(sensorId, measurementTypes, dateStart, dateEnd, utcOffset))
                }
            }).fetch();
            return result;
        } else {
            return [];
        }
    }
});
