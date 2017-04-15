import get from "lodash.get";

Meteor.methods({

    getTags: (primaryTags) => {

        const searchPrimaryTags = {
            "measurementsInfo.primaryTags": {
                $in: primaryTags
            }
        }; 

        const sensors = Sensors.find({
            ...primaryTags && primaryTags.length > 0 && searchPrimaryTags
        }).fetch();

        const tags = sensors.filter(x => x.measurementsInfo).reduce((state, sensor) => {

            const sensorTags = sensor.measurementsInfo.reduce((tags, measurementInfo) => {
                return [...tags, ...get(measurementInfo, "tags", [])];
            });

            return [...state, ...sensorTags];
        }, []);

        return _.uniq(tags).map(tag => ({
            label: tag,
            value: tag
        }));
    },

    getPrimaryTags: () => {
        const sensors = Sensors.find().fetch();

        const primaryTags = sensors.filter(x => x.measurementsInfo).reduce((state, sensor) => {

            const sensorPrimaryTags = sensor.measurementsInfo.reduce((tags, measurementInfo) => {
                return [...tags, ...get(measurementInfo, "primaryTags", [])];
            });

            return [...state, ...sensorPrimaryTags];
        }, []);

        return _.uniq(primaryTags).map(tag => ({
            label: tag,
            value: tag
        }));
    },

    getSensors: (startIndex = 0, endIndex = 20, primaryTags, tags, search = "") => {

        const query = {
            description: {
                $regex: search
            }
        };

        const searchTags = {
            "measurementsInfo.tags": {
                $in: tags
            }
        };

        const searchPrimaryTags = {
            "measurementsInfo.primaryTags": {
                $in: primaryTags
            }
        };

        console.log({
            ...search && query,
            ...tags && tags.length > 0 && searchTags,
            ...primaryTags && primaryTags.length > 0 && searchPrimaryTags
        });

        const sensors = Sensors.find({
            ...search && query,
            ...tags && tags.length > 0 && searchTags,
            ...primaryTags && primaryTags.length > 0 && searchPrimaryTags
        }, {
            skip: startIndex,
            limit: endIndex - startIndex
        }).fetch();

        return sensors;
    }
})
