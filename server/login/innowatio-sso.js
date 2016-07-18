import {HTTP} from "meteor/http";
import {getUserId} from "./methods"

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
    if (200 === result.statusCode && result.data.tokenId) {
        return getUserId(result.data.tokenId);
    } else {
        return {
            error: new Meteor.Error(401, "authentication-failed")
        };
    }
});