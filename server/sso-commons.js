export function getSessionInfo (token) {
    try {
        const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${token}?_action=validate`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (200 != result.statusCode && result.data) {
            throw new Meteor.Error(500, "api-call-failed");
        }
        return result.data;
    } catch (error) {
        throw new Meteor.Error(400, 'get-session-info-failed');
    }
}

export function getUserInfo (uid, token) {
    try {
        const result = HTTP.get(`https://sso.innowatio.it/openam/json/users/${uid}`, {
            headers: {
                "iplanetDirectoryPro": token,
                "Content-Type": "application/json"
            }
        });
        if (200 != result.statusCode && result.data) {
            throw new Meteor.Error(500, "api-call-failed");
        }
        return result.data;
    } catch (error) {
        throw new Meteor.Error(404, "user-not-found");
    }
}

export function isSingleSignOnEnabled() {
    return !process.env.SKIP_SSO;
}