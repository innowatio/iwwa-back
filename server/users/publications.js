import {userHasRole} from "../publications-commons";

Meteor.publishComposite("users", {
    find: function () {
        const user = Meteor.users.findOne({_id: this.userId});
        if (!user) {
            return null;
        }
        if (userHasRole(user, "view-all-users")) {
            return Meteor.users.find({});
        }
        let familyUsersIds = [this.userId];
        findChildren(familyUsersIds, Meteor.users, this.userId);
        return Meteor.users.find({_id: {$in: familyUsersIds}});
    },
    children: [
        {
            find: function (user) {
                if (user.groups) {
                    return Groups.find({
                        name: {$in: user.groups}
                    });
                }
            }
        }
    ]
});

function findChildren (familyUsersIds, users, parentUserId) {
    const children = users.find({"profile.parentUserId": parentUserId});
    children && children.forEach(child => {
        const childId = child._id;
        familyUsersIds.push(childId);
        findChildren(familyUsersIds, users, childId);
    });
}