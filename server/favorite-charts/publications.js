Meteor.publish("favoriteChartsByType", function (type) {
    check(type, String);
    let owner = this.userId;
    return FavoriteCharts.find({
        type,
        owner
    });
});
