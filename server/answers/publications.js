import {userHasRole} from "../publications-commons";

Meteor.publish("answers", function ({siteId, category, type}) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (_.contains(user.sites, siteId) || userHasRole(user, "view-all-users")) {
       return Answers.find({
           _id: `${type}-${category}-${siteId}`
       });
    }
    return null;
});
