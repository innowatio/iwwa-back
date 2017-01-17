import {getUserObjectsIds} from "../publications-commons";

function getId (sensorId, year, source, measurementType) {
    return `${sensorId}-${year}-${source}-${measurementType}`;
}

Meteor.publish("yearlyConsumptions", (sensorId, year, source, measurementType) => {
    check(sensorId, String);
    check(year, String);
    check(source, String);
    check(measurementType, String);

    return ConsumptionsYearlyAggregates.find({
        _id: getId(sensorId, year, source, measurementType)
    });
});

Meteor.publish("dashboardYearlyConsumptions", function () {

    const user = Meteor.users.findOne({
        _id: this.userId
    });

    if (user) {
        const sitesIds = getUserObjectsIds(user, "view-all-sites", Sites, "sites");
        const currentYear = moment().format("YYYY");

        const ids = sitesIds.reduce((state, id) => {

            const site = Sites.findOne({
                _id: id
            });

            const sensors = Sensors.find({
                _id: {
                    $in: site.sensorsIds
                }
            }).fetch();

            const comfort = sensors.find(x => {
                return _.contains(x.measurementsType, "comfort");
            });

            const sensorIds = site.defaultSensor || id;
            const comfortId = comfort ? comfort._id : id;
            
            return [
                ...state,
                `${sensorIds}-${currentYear}-reading-activeEnergy`,
                `${sensorIds}-${currentYear}-reference-activeEnergy`,
                `${comfortId}-${currentYear}-reading-comfort`
            ];
        }, []);

        return ConsumptionsYearlyAggregates.find({
            _id: {
                $in: ids
            }
        });
    }
});
