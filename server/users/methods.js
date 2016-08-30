import {getUserInfo} from "../sso-commons";

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
    saveRegistrationId: function (appRegistrationId, device) {
        check(appRegistrationId, String);
        check(device, Object);
        check(device.uuid, String);
        check(device.model, String);
        check(device.platform, String);
        check(device.version, String);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        Meteor.users.update({_id: userId}, {
            $set: {
                "services.apn.devices": [{
                    uuid: device.uuid,
                    model: device.model,
                    platform: device.platform,
                    version: device.version,
                    token: appRegistrationId
                }]
            }
        });
    },
    saveFCMToken: function (token, device) {
        check(token, String);
        check(device, Object);
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }
        Meteor.users.update({_id: userId}, {
            $set: {
                "services.fcm": {
                    device,
                    token
                }
            }
        });
    },
    getUserInfo: () => {
        const user = Meteor.user();
        return user ? getUserInfo(user.services.sso.uid, user.services.sso.token) : {};
    }
});
