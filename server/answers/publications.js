Meteor.publish("answers", function ({siteId, category, type}) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (_.contains(user.sites, siteId) || _.contains(user.groups, "admin")) {
       return Answers.find({
           _id: `${type}-${category}-${siteId}`
       });
    }
    return null;
});
