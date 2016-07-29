Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Questions.find().count() === 0
    ) {
        Questions.insert(JSON.parse(Assets.getText("fixtures/questions/building.json")));
        Questions.insert(JSON.parse(Assets.getText("fixtures/questions/demographics.json")));
        Questions.insert(JSON.parse(Assets.getText("fixtures/questions/survey.json")))
    }
});
