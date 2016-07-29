Meteor.publish("answers", function ({siteId, category, type}) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (!_.contains(user.siti, siteId)) {
       return null;
    }
    return Answers.find({
        _id: `${type}-${category}-${siteId}`
    });
});
