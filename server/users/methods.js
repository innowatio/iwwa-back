Meteor.methods({
    sendResetEmail: function (targetUserId) {
        check(targetUserId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        Accounts.sendResetPasswordEmail(targetUserId);
    },
    setPassword: function (targetUserId, newPassword) {
        check(targetUserId, String);
        check(newPassword, String);
        if (newPassword === "") {
            throw new Meteor.Error("The password must not be null")
        }
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        Accounts.setPassword(targetUserId, newPassword);
    },
    saveRegistrationId: function (appRegistrationId) {
        check(appRegistrationId, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        Meteor.users.update({_id: userId}, {$set: {appRegistrationId}});
    }
});
