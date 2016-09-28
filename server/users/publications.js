Meteor.publishComposite("users", {
    find: function () {
        var user = Meteor.users.findOne({_id: this.userId});
        if (!user) {
            return null;
        }
        if (!_.contains(user.roles, "admin")) {
            return Meteor.users.find({_id: this.userId});
        }
        return Meteor.users.find({});
    },
    children: [
        {
            find: function (user) {
                if (user.groups) {
                    return Groups.find({
                        name: {$in: user.groups}
                    });
                }
            },
            children: [
                {
                    find: function(group) {
                        if (group.roles) {
                            return Roles.find({
                                name: {$in: group.roles}
                            });
                        }
                    }
                }
            ]
        }
    ]
});
