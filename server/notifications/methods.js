Meteor.methods({
    getUnreadNotifications: () => {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        return Notifications.find({
            userId: userId,
            readed: false
        }).fetch().length;
    },
    setReadedNotifications: () => {
        var userId = Meteor.userId();
        Notifications.update({
            userId: userId,
            readed: false
        }, {
            $set: {
                readed: true
            }
        });
    }
});
