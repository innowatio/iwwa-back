Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Sites.find().count() === 0
    ) {
        Sites.insert(JSON.parse(Assets.getText("fixtures/sites/test-sites-1.json")));
        Sites.insert(JSON.parse(Assets.getText("fixtures/sites/test-sites-2.json")));
    }
});
