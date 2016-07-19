import {HTTP} from "meteor/http";

Accounts.registerLoginHandler("sso", (options) => {
    if (!options.sso) {
        return undefined;
    }
    const {username, password} = options.sso;
    const result = HTTP.post("https://sso.innowatio.it/openam/json/authenticate", {
        headers: {
            "X-OpenAM-Username": username,
            "X-OpenAM-Password": password,
            "Content-Type": "application/json"
        }
    });
    const {tokenId} = result.data;
    if (200 === result.statusCode && tokenId) {
        if (setTokenOnInnowatioSSO(tokenId)) {
            return getUserId(tokenId);
        } else {
            throw new Meteor.Error(401, "set-innowatio-sso-token-failed");
        }
    } else {
        throw new Meteor.Error(401, "authentication-failed");
    }
});

Accounts.validateLoginAttempt(function (attempt) {
    if (attempt.type == "resume") {
        checkToken(attempt.user);
    }
    return true;
});

function checkToken (user) {
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${user.innowatioToken}?_action=validate`);
    if (200 != result.statusCode || false === result.data.valid) {
        throw new Meteor.Error(401, "invalid-token");
    } else {
        return insertOrUpdateUser(user._id, user.innowatioToken);
    }
}

function getUserId (tokenId) {
    const result = HTTP.post("https://sso.innowatio.it/openam/json/users?_action=idFromSession", {
        headers: {
            "iplanetDirectoryPro": tokenId,
            "Content-Type": "application/json"
        }
    });
    if (200 === result.statusCode) {
        return insertOrUpdateUser(result.data.id, tokenId);
    } else {
        throw new Meteor.Error(400, 'get-userid-failed');
    }
}

function insertOrUpdateUser (userId, tokenId) {
    const user = Meteor.users.findOne({
        "_id": userId
    });
    const userInfo = getUserInfo(userId, tokenId);
    if (!userInfo) {
        throw new Meteor.Error(400, 'get-user-info-failed');
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

function setTokenOnInnowatioSSO (tokenId) {
    const result = HTTP.post("https://sso.innowatio.it/tokenId", {
        data: {
            "tokenId": tokenId
        }
    });
    console.log(result);
    return 200 === result.statusCode;
}

function getTokenFromInnowatioSSO () {
    const result = HTTP.get("https://sso.innowatio.it/tokenId");
    console.log(result);
}