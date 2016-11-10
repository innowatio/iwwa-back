//TODO need to move in groups methods

Meteor.methods({
    toggleUserRole: function (role, targetUserId) {
        check(targetUserId, String);
        check(role, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        var targetUser = Meteor.users.findOne({_id: targetUserId});
        var userHasRole = _.contains(targetUser.roles, role);
        Meteor.users.update({_id: targetUserId}, {
            [userHasRole ? "$pull" : "$addToSet"]: {
                roles: role
            }
        });
    }
});
