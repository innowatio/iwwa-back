Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Filters.find().count() === 0
    ) {
        JSON.parse(Assets.getText("fixtures/filters/filters.json")).map(group => {
            Filters.insert(group);
        });
    }
});
