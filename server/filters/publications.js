Meteor.publishComposite("filters", {
    find: function () {
        return Filters.find();
    }
});
