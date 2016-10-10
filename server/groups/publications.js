Meteor.publishComposite("groups", {
    find: function () {
        return Groups.find();
    }
});
