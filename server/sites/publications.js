import {userHasRole} from "../publications-commons";

Meteor.publish("sites", function () {
    const user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (userHasRole(user, "view-all-sites")) {
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
