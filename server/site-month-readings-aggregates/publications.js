Meteor.publish("misureBySitoAndMonth", function (sitoId, dateMonth) {
    check(sitoId, String);
    var sito = Siti.findOne({
        _id: sitoId
    });
    if (!sito) {
        return null;
    }
    var query = SiteMonthReadingsAggregates.find({
        podId: sito.pod,
        month: dateMonth
    });
    return query;
});
