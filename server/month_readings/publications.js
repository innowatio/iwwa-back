Meteor.publish("misureBySito2", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({
        _id: sitoId
    });
    if (!sito) {
        return null;
    }
    var query = MonthReadings.find({
        podId: sito.pod
    });
    return query;
});
