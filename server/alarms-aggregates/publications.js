import {daysInInterval, getUserSensorsIds} from "../publications-commons";

function getIds (alarms, dateStart, dateEnd) {
    return alarms.map(alarm => {
        return daysInInterval(dateStart, dateEnd).map(day => `${alarm._id}-${day}`)
    });
}

Meteor.publish("userAlarmsAggregates", function () {
    const userAlarms = Alarms.find({
        userId: this.userId
    }).fetch();

    return AlarmsAggregates.find({
        alarmId: {
            $in: userAlarms.map(x => x._id)
        }
    });
});

Meteor.publish("alarmsAggregates", function (measurementType, startDate, endDate) {
    const userAlarms = Alarms.find({
        userId: this.userId,
        measurementType
    }).fetch();

    return AlarmsAggregates.find({
        _id: {
            $in: _.flatten(getIds(userAlarms, startDate, endDate))
        }
    });
});

Meteor.publish("dashboardAlarmsAggregates", function () {
    const dashboardAlarms = Alarms.find({
        sensorId: {
            $in: getUserSensorsIds(this.userId)
        }
    }).fetch();

    return AlarmsAggregates.find({
        alarmId: {
            $in: dashboardAlarms.map(x => x._id)
        }
    });
});
