import {daysInInterval} from "../publications-commons";

function getIds (sensorId, dateStart, dateEnd, source, measurementType) {
    return daysInInterval(dateStart, dateEnd).map(day => (
        `${sensorId}-${day}-${source}-${measurementType}`
    ));
}

Meteor.publish("dailyMeasuresBySensor", (sensorId, dateStart, dateEnd, source, measurementType) => {
    check(sensorId, String);
    check(measurementType, String);
    check(source, String);
    check(dateStart, String);
    check(dateEnd, String);
    /*
    *   Instead of querying on the properties `sensorId`, `day`, `source`
    *   and `measurementType`, since the `_id` is constructed by the aggregator
    *   which writes the element to the collection concatenating those 4
    *   properties, we can re-construct the `_id` using the same method and use
    *   it for the query.
    */
    return ReadingsDailyAggregates.find({
        _id: {
            $in: getIds(sensorId, dateStart, dateEnd, source, measurementType)
        }
    });
});
