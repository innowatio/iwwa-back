Meteor.methods({
    getUnreadNotifications: () => {
        console.log("getUnreadNotifications");
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
        
    }
});
