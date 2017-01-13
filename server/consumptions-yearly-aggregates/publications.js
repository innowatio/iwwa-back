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
            return [
                ...state,
                `${id}-${currentYear}-reading-activeEnergy`,
                `${id}-${currentYear}-reading-comfort`,
                `${id}-${currentYear}-reference-activeEnergy`
            ];
        }, []);

        return ConsumptionsYearlyAggregates.find({
            _id: {
                $in: ids
            }
        });
    }
});
