Meteor.publish("sites", function () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (_.contains(user.roles, "admin")) {
       return Sites.find({});
    }
    if (!user.siti) {
       return null;
    }
    return Sites.find({
        _id: {
            $in: user.siti
        }
    });
});
