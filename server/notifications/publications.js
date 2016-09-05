Meteor.publish("notifications", function () {
    const userId = this.userId;
    if (!userId) {
        return null;
    }
    return Notifications.find({userId});
});
