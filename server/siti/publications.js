Meteor.publish("siti", function () {
    return Siti.find({}, {
        fields: {
            idCoin: 1,
            pod: 1,
            societa: 1
        }
    });
});
