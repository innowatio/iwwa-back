Meteor.methods({
    addSitoToUser: function (sitoId, targetUserId) {
        check(sitoId, String);
        check(targetUserId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        var sito = Sites.findOne({
            _id: sitoId
        });
        if (!sito) {
            throw new Meteor.Error("Site does not exist");
        }
        Meteor.users.update({_id: targetUserId}, {
            $addToSet: {
                siti: sitoId
            }
        });
    },
    removeSitoFromUser: function (sitoId, targetUserId) {
        check(sitoId, String);
        check(targetUserId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        var sito = Sites.findOne({
            _id: sitoId
        });
        if (!sito) {
            throw new Meteor.Error("Site does not exist");
        }
        Meteor.users.update({_id: targetUserId}, {
            $pull: {
                siti: sitoId
            }
        });
    }
});
