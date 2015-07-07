Meteor.publish("misureBySito", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({_id: new Mongo.ObjectID(sitoId)});
    return Misure.find({pod: sito.pod});
});
