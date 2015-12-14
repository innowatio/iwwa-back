
Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Sites.find().count() === 0
    ) {
        Sites.insert({
            "_id" : "fakeSite",
            "Origine" : "TEST",
            "idCoin" : "idTest",
            "pod" : "podId",
            "societa" : "TEST"
        });
    }
});
