Meteor.methods({

    getTags: (primaryTags) => {

        const searchPrimaryTags = {
            primaryTags: {
                $in: primaryTags
            }
        }; 

        const sensors = Sensors.find({
            ...primaryTags && primaryTags.length > 0 && searchPrimaryTags
        }).fetch();

        const tags = sensors.reduce((state, sensor) => {
            return [...state, ...sensor.tags || []];
        }, []);

        return _.uniq(tags).map(tag => ({
            label: tag,
            value: tag
        }));
    },

    getPrimaryTags: () => {
        const sensors = Sensors.find().fetch();

        const primaryTags = sensors.reduce((state, sensor) => {
            return [...state, ...sensor.primaryTags || []];
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
            tags: {
                $in: tags
            }
        };

        const searchPrimaryTags = {
            primaryTags: {
                $in: primaryTags
            }
        };

        const sensors = Sensors.find({
            ...query,
            ...tags && tags.length > 0 && searchTags,
            ...primaryTags && primaryTags.length > 0 && searchPrimaryTags
        }, {
            skip: startIndex,
            limit: endIndex - startIndex
        }).fetch();

        return sensors;
    }
})
