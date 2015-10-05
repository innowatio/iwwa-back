Meteor.methods({
    addSitoToUser: function (sitoId) {
        check(sitoId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        var sito = Siti.findOne({$or: [
            {_id: new Mongo.ObjectID(sitoId)},
            {_id: sitoId}
        ]});
        if (!sito) {
            throw new Meteor.Error("Site does not exist");
        }
        Meteor.users.update({_id: userId}, {
            $addToSet: {
                siti: sitoId
            }
        });
    },
    removeSitoFromUser: function (sitoId) {
        check(sitoId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        var sito = Siti.findOne({$or: [
            {_id: new Mongo.ObjectID(sitoId)},
            {_id: sitoId}
        ]});
        if (!sito) {
            throw new Meteor.Error("Site does not exist");
        }
        Meteor.users.update({_id: userId}, {
            $pull: {
                siti: sitoId
            }
        });
    }
})
