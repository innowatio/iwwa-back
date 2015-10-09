Meteor.publish("users", function () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user || !_.contains(user.roles, "admin")) {
        return null;
    }
    return Meteor.users.find({}, {
        fields: {
            profile: 1,
            emails: 1,
            siti: 1,
            roles: 1,
            createdAt: 1
        }
    });
});
