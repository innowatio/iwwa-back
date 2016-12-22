import {getUserSensorsIds} from "../publications-commons";

Meteor.publish("alarms", function () {
    return Alarms.find({
        userId: this.userId
    });
});

Meteor.publish("dashboardAlarms", function () {
    return Alarms.find({
        sensorId: {
            $in: getUserSensorsIds(this.userId)
        }
    });
});
