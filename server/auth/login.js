import {HTTP} from "meteor/http";
import {getSessionInfo, isProduction} from "../sso-commons";

Accounts.registerLoginHandler("sso", (options) => {
    if (!options.sso) {
        return undefined;
    }
    logFunc("registerLoginHandler");
    log("options", options);
    return isProduction() ? loginWithCredentials(options.sso) : retrieveUpsertUser(options.sso.username);
});

Accounts.registerLoginHandler("token", (options) => {
    if (!options.token) {
        return undefined;
    }
    logFunc("registerLoginHandler");
    log("options", options);
    return loginWithToken(options.token);
});

Accounts.validateLoginAttempt((attempt) => {
    logFunc("validateLoginAttempt");
    log("attempt", attempt);
    if (attempt.type === "resume") {
        if (!attempt.user || !attempt.user.services || !attempt.user.services.sso) {
            throw new Meteor.Error(400, "invalid-db-user");
        }
        return isProduction() ? loginWithToken(attempt.user.services.sso.token) : true;
    }
    return true;
});

Accounts.onLogout((session) => {
    logFunc("onLogout");
    log("session", session);
    if (session && session.user && session.user.services && session.user.services.sso) {
        invalidateToken(session.user.services.sso.token);
    }
});

function loginWithToken (token) {
    logFunc("loginWithToken");
    const sessionInfo = getSessionInfo(token);
    if (false === sessionInfo.valid) {
        throw new Meteor.Error(401, "invalid-session");
    } else {
        return retrieveUpsertUser(sessionInfo.uid, token);
    }
}

function loginWithCredentials ({username, password}) {
    logFunc("loginWithCredentials");
    const result = HTTP.post("https://sso.innowatio.it/openam/json/authenticate", {
        headers: {
            "X-OpenAM-Username": username,
            "X-OpenAM-Password": password,
            "Content-Type": "application/json"
        }
    });
    const {tokenId} = result.data;
    if (200 != result.statusCode || !tokenId) {
        throw new Meteor.Error(401, "authentication-failed");
    } else {
        const sessionInfo = getSessionInfo(tokenId);
        return retrieveUpsertUser(sessionInfo.uid, tokenId);
    }
}

function invalidateToken (token) {
    log("token", token);
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/?_action=logout`, {
        headers: {
            "Content-Type": "application/json",
            "iplanetDirectoryPro": token
        }
    });
    log("result", result);
}

function retrieveUpsertUser (uid, token) {
    logFunc("retrieveUpsertUser");
    log("uid", uid);
    log("token", token);
    Meteor.users.upsert({
        "services.sso.uid": uid
    }, {
        $set: {
            "services.sso": {
                "token": token,
                "uid": uid
            }
        }
    });
    const user = Meteor.users.findOne({
        "services.sso.uid": uid
    });
    return {
        userId: user._id
    };
}

function log (name, message) {
    // console.log(`============== ${name} =============`);
    // console.log(message);
    // console.log(`============= /${name} =============`);
}

function logFunc (func) {
    // console.log(`=========================== ${func} ===========================`);
}