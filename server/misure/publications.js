Meteor.publish("misureBySito", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({$or: [
        {_id: new Mongo.ObjectID(sitoId)},
        {_id: sitoId}
    ]});
    return sito && Misure.find({pod: sito.pod});
});



Meteor.publish("misureBySitoTwoMonths", function (sitoId) {
    check(sitoId, String);
    var sito = Siti.findOne({$or: [
        {_id: new Mongo.ObjectID(sitoId)},
        {_id: sitoId}
    ]});
    var startingDate = moment(new Date()).subtract(2, 'months')._d;
    var misure = Misure.find({$and : [{pod: sito.pod}, {data: {$gt: startingDate.toISOString()}}]});
    return sito && misure;
});
