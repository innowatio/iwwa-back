Meteor.publish("misureBySito", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({$or: [
        {_id: new Mongo.ObjectID(sitoId)},
        {_id: sitoId}
    ]});
    return sito && Misure.find({pod: sito.pod});
});
