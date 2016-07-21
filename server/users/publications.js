Meteor.publish("users", function () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
        return null;
    }
    if (!_.contains(user.roles, "admin")) {
        return Meteor.users.find({_id: this.userId});
    }
    return Meteor.users.find({}, {
        fields: {
            profile: 1,
            emails: 1,
            siti: 1,
            roles: 1,
            createdAt: 1,
            "services.innowatioSSO": 1
        }
    });
});
