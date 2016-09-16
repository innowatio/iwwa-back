Meteor.publishComposite("groups", {
    find: function () {
        return Groups.find();
    },
    children: [{
        find: function (group) {
            return Meteor.users.find({
                groups: group.name
            }, {
                fields: {
                    profile: 1
                }
            });
        }
    }]
});
