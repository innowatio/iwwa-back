import {HTTP} from 'meteor/http';

Accounts.registerLoginHandler("sso", (options) => {

    if (!options.sso) {
        return undefined;
    }

    const {email, password} = options.sso;
    const result = HTTP.post("https://sso.innowatio.it/openam/json/authenticate", {
        headers: {
            "X-OpenAM-Username": email,
            "X-OpenAM-Password": password,
            "Content-Type": "application/json"
        }
    })

    if (200 === result.statusCode && result.data.tokenId) {
        console.log("Authenticated with SSO Innowatio");
        const user = Meteor.users.findOne({
            "emails.address": email
        });

        Meteor.users.update({
            _id: user._id,
            'emails.address': email
        }, {
            $set: {
                'innowatioToken': result.data.tokenId
            }
        });

        if (user) {
            return {
                userId: user._id
            }
        } else {
            return {
                error: new Meteor.Error(404, 'user-not-found')
            }
        }
    } else {
        return {
            error: new Meteor.Error(401, 'authentication-failed')
        }
    }
});