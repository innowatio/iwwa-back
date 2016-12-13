Meteor.publish("sites", function () {
    const user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    const userRoles = _.flatten(Groups.find({
        name: {
            $in: user.groups
        }
    }).map(group => group.roles));
    if (_.contains(userRoles, "view-all-sites")) {
       return Sites.find({
           isDeleted: {
               $ne: true
           }
       });
    }
    if (!user.sites) {
       return null;
    }
    return Sites.find({
        _id: {
            $in: user.sites
        },
        isDeleted: {
            $ne: true
        }
    });
});
