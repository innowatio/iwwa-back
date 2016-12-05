import {daysInInterval} from "../publications-commons";

function getIds (alarms, dateStart, dateEnd) {
    return alarms.map(alarm => {
        return daysInInterval(dateStart, dateEnd).map(day => `${alarm._id}-${day}`)
    });
}

Meteor.publish("alarmsAggregates", function (measurementType, startDate, endDate) {
    const userAlarms = Alarms.find({
        userId: this.userId,
        measurementType
    }).fetch();

    const alarmsAggregates = AlarmsAggregates.find({
        _id: {
            $in: _.flatten(getIds(userAlarms, startDate, endDate))
        }
    });

    return alarmsAggregates;
});
