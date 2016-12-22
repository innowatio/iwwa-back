import {getUserSensorsIds} from "../publications-commons";

Meteor.publish("readingsRealTimeAggregatesBySite", (siteId) => {

    const site = Sites.findOne({
        _id: siteId
    })

    return ReadingsRealTimeAggregates.find({
        sensorId: {
            $in: site.sensorsIds
        }
    });
});

Meteor.publish("dashboardRealtimeAggregates", function () {
    return ReadingsRealTimeAggregates.find({
        sensorId: {
            $in: getUserSensorsIds(this.userId)
        }
    });
});
