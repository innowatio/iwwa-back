Meteor.publish("alarms", function () {
    return Alarms.find();
});
