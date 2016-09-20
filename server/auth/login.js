import {HTTP} from "meteor/http";
import {getSessionInfo, isSingleSignOnEnabled} from "../sso-commons";
import bunyan from "bunyan";
import Elasticsearch from "bunyan-elasticsearch";

var esStream = new Elasticsearch({
    indexPattern: "[meteor-auth-]YYYY.MM.DD",
    type: "logs",
    host: process.env.ELASTIC_SEARCH_HOST
});

esStream.on("error", function (err) {
    console.log('Elasticsearch Stream Error:', err.stack);
});

const log = bunyan.createLogger({
    name: "meteor-auth",
    streams: [{
        stream: process.env.ENVIRONMENT === "production" ? esStream : process.stdout
    }]
});

Accounts.registerLoginHandler("sso", (options) => {
    if (!options.sso) {
        return undefined;
    }
    log.info({
        username: options.sso.username,
        password: options.sso.password ? "***" : undefined
    }, "registerLoginHandler [sso]");
    return isSingleSignOnEnabled() ? loginWithCredentials(options.sso) : retrieveUpsertUser(options.sso.username);
});

Accounts.registerLoginHandler("token", (options) => {
    if (!options.token) {
        return undefined;
    }
    log.info({
        token: token ? "***" : undefined
    }, "registerLoginHandler [token]");
    return loginWithToken(options.token);
});

Accounts.validateLoginAttempt((attempt) => {
    if (attempt.type === "resume") {
        if (!attempt.user || !attempt.user.services || !attempt.user.services.sso) {
            throw new Meteor.Error(400, "invalid-db-user");
        }
        log.info({
            username: attempt.user.services.sso.uid
        }, "validateLoginAttempt");
        return isSingleSignOnEnabled() ? loginWithToken(attempt.user.services.sso.token) : true;
    }
    return true;
});

Accounts.onLogout((session) => {
    if (session && session.user && session.user.services && session.user.services.sso) {
        invalidateToken(session.user.services.sso.token);
    }
});

function loginWithToken (token) {
    const sessionInfo = getSessionInfo(token);
    if (false === sessionInfo.valid) {
        throw new Meteor.Error(401, "invalid-session");
    } else {
        return retrieveUpsertUser(sessionInfo.uid, token);
    }
}

function loginWithCredentials ({username, password}) {
    try {
        const result = HTTP.post("https://sso.innowatio.it/openam/json/authenticate", {
            headers: {
                "X-OpenAM-Username": username,
                "X-OpenAM-Password": password,
                "Content-Type": "application/json"
            }
        });
        log.info({result}, "authenticate sso credentials result");
        const {tokenId} = result.data;
        if (200 != result.statusCode || !tokenId) {
            throw new Meteor.Error(500, "api-call-failed");
        }
        const sessionInfo = getSessionInfo(tokenId);
        return retrieveUpsertUser(sessionInfo.uid, tokenId);
    } catch (error) {
        throw new Meteor.Error(401, "authentication-failed-or-network");
    }
}

function invalidateToken (token) {
    try {
        const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/?_action=logout`, {
            headers: {
                "Content-Type": "application/json",
                "iplanetDirectoryPro": token
            }
        });
        log.info({result}, "invalidateToken");
    } catch (error) {
        throw new Meteor.Error(500, "token-invalidation-failed");
    }
}

function retrieveUpsertUser (uid, token) {
    log.info({uid}, "retrieveUpsertUser");
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
