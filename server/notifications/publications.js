Meteor.publish("notifications", function () {
    return Notifications.find({
        userId: this.userId
    }, {sort: {date: 1}});
});
