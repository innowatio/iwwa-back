Meteor.publish("answers", function ({siteId, category, type}) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    //TODO replace _.contains(user.groups, "admin") with permission role check
    if (_.contains(user.sites, siteId) || _.contains(user.groups, "admin")) {
       return Answers.find({
           _id: `${type}-${category}-${siteId}`
       });
    }
    return null;
});
