Meteor.publish("sensors", function () {
    return Sensors.find();
});
