Meteor.methods({
    checkToken: checkToken
});

function checkToken () {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
        return {
            error: new Meteor.Error(404, "user-not-found")
        };
    }
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${user.innowatioToken}?_action=validate`);
    if (200 != result.statusCode || false === result.data.valid) {
        return {
            error: new Meteor.Error(401, "invalid-token")
        };
    } else {
        return getUserId(user.innowatioToken);
    }
}

export function getUserId (tokenId) {
    const result = HTTP.post("https://sso.innowatio.it/openam/json/users?_action=idFromSession", {
        headers: {
            "iplanetDirectoryPro": tokenId,
            "Content-Type": "application/json"
        }
    });
    if (200 === result.statusCode) {
        return insertOrUpdateUser(result.data.id, tokenId);
    } else {
        return {
            error: new Meteor.Error(400, 'get-userid-failed')
        };
    }
}

function insertOrUpdateUser (userId, tokenId) {
    const user = Meteor.users.findOne({
        "_id": userId
    });
    const userInfo = getUserInfo(userId, tokenId);
    if (!userInfo) {
        return {
            error: new Meteor.Error(400, 'get-user-info-failed')
        };
    }
    if (user) {
        Meteor.users.update({
            _id: user._id
        }, {
            $set: {
                "innowatioToken": tokenId
            }
        });
    } else {
        Meteor.users.insert({
            _id: userId,
            "innowatioToken": tokenId,
            "emails": userInfo.mail
        });
    }
    return {
        userId: userId
    }
}

function getUserInfo (userId, tokenId) {
    const result = HTTP.get(`https://sso.innowatio.it/openam/json/users/${userId}`, {
        headers: {
            "iplanetDirectoryPro": tokenId,
            "Content-Type": "application/json"
        }
    });
    if (200 === result.statusCode) {
        return result.data;
    }
}