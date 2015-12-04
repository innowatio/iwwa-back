
Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Siti.find().count() === 0
    ) {
        Siti.insert({
    "_id" : "fakeSite",
    "Origine" : "TEST",
    "idCoin" : "idTest",
    "pod" : "podId",
    "societa" : "TEST"
});
    }
});
