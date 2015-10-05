Meteor.publish("users", function () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user || !_.contains(user.roles, "admin")) {
        return null;
    }
    return Meteor.users.find({}, {
        fields: {
            siti: 1
        }
    });
});
