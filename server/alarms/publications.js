Meteor.publish("alarms", function () {
    return Alarms.find({
        userId: this.userId
    });
});
