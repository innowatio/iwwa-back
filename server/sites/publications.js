Meteor.publish("sites", function () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (_.contains(user.groups, "admin")) {
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
