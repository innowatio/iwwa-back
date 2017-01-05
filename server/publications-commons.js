const DATE_FORMAT = "YYYY-MM-DD";
const oneDayInMs = moment.duration(1, "day").asMilliseconds();

export function daysInInterval (start, end) {
    const startMs = moment(start).startOf("day").valueOf();
    const endMs = moment(end).startOf("day").valueOf();
    const numberOfDays = (endMs - startMs) / oneDayInMs;
    const days = [];
    for (var i=0; i<=numberOfDays; i++) {
        days.push(
            moment(startMs).add(i, "days").format(DATE_FORMAT)
        );
    }
    return days;
}

export function getUserSensorsIds (userId) {

    const user = Meteor.users.findOne({
        _id: userId
    });

    if (user) {
        const sitesIds = getUserObjectsIds(user, "view-all-sites", Sites, "sites");
        const sensorsIds = getUserObjectsIds(user, "view-all-sensors", Sensors, "sensors");

        const sites = Sites.find({
            _id: {
                $in: sitesIds
            }
        }).fetch();

        const sitesSensors = sites.reduce((state, site) => {
            return [
                ...state,
                ...site.sensorsIds
            ];
        }, []);

        return _.uniq([
            ...sitesSensors,
            ...sensorsIds,
            ...sitesIds
        ]);
    }

    return [];
}

export function userHasRole (user, role) {
    const userRoles = _.flatten(Groups.find({
        name: {
            $in: user.groups || []
        }
    }).map(group => group.roles));
    return _.contains(userRoles, role);
}

export function getUserObjectsIds (user, permission, collection, userAttr) {
    if (userHasRole(user, permission)) {
        return _.flatten(collection.find().map(elem => elem._id));
    } else {
        return user[userAttr] || [];
    }
}