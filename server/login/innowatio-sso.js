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
        return insertOrUpdateUser(username, tokenId);
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
    const tokenId = user.services.innowatioSSO.token;
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${tokenId}?_action=validate`);
    console.log(result);
    if (200 != result.statusCode || false === result.data.valid) {
        throw new Meteor.Error(401, "invalid-token");
    } else {
        return insertOrUpdateUser(user.username, tokenId);
    }
}

//unnecessary for now because userId == username
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
    const userInfo = getUserInfo(userId, tokenId);
    if (!userInfo) {
        throw new Meteor.Error(400, 'get-user-info-failed');
    }
    const user = Meteor.users.findOne({
        "username": userId
    });
    const uuid = user ? user._id : inserUser(userInfo);
    updateUser(uuid, userInfo, tokenId);
    return {
        userId: uuid
    }
}

function inserUser (userInfo) {
    return Accounts.createUser({
        username: userInfo.uid[0]
    });
}

function updateUser (userId, userInfo, tokenId) {
    Meteor.users.update({
        _id: userId
    }, {
        $set: {
            "emails": [{
                "address": userInfo.mail[0],
                "verified": true
            }],
            "services.innowatioSSO": {
                "token": tokenId,
                "uid": userInfo.uid[0]
            }
        }
    });
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