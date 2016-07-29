Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Answers.find().count() === 0
    ) {
        Answers.insert(JSON.parse(Assets.getText("fixtures/answers/building.json")));
        Answers.insert(JSON.parse(Assets.getText("fixtures/answers/demographics.json")));
        Answers.insert(JSON.parse(Assets.getText("fixtures/answers/heating.json")));
    }
});
