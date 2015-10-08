Meteor.publish("misureBySito", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({
        _id: sitoId
    });
    if (!sito) {
        return null;
    }
    return Misure.find({
        pod: sito.pod
    }, {
        sort: {
            data: -1
        }
    });
});
