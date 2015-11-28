var sitiOptions = {
    fields: {
        _id: 1,
        name: 1,
        pods: 1,
        otherSensors: 1
    }
};

Meteor.publish("sites", function () {
    return Sites.find({}, sitiOptions);
});
