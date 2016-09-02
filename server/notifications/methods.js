Meteor.methods({
    getUnreadNotifications: () => {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        return Notifications.find({
            userId: userId,
            readed: {$ne: true}
        }).fetch();
    }
});
