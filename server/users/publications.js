Meteor.publishComposite("users", {
    find: function () {
        var user = Meteor.users.findOne({_id: this.userId});
        if (!user) {
            return null;
        }
        if (!_.contains(user.groups, "admin")) {
            return Meteor.users.find({_id: this.userId});
        }
        return Meteor.users.find({}, {
            fields: {
                profile: 1,
                emails: 1,
                sites: 1,
                sensors: 1,
                createdAt: 1,
                services: 1,
                surveys: 1,
                groups: 1
            }
        });
    },
    children: [
        {
            find: function (user) {
                return Groups.find({
                    name: {$in: user.groups}
                });
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
