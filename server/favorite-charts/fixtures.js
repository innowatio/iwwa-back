Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        FavoriteCharts.find().count() === 0
    ) {
        JSON.parse(Assets.getText("fixtures/favorite-charts/test-favorites.json")).map((favorite) => {
            FavoriteCharts.insert(favorite);
        });
    }
});
