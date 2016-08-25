export function getSessionInfo (token) {
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${token}?_action=validate`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (200 === result.statusCode) {
        return result.data;
    } else {
        throw new Meteor.Error(400, 'get-session-info-failed');
    }
}

export function getUserInfo (uid, token) {
    const result = HTTP.get(`https://sso.innowatio.it/openam/json/users/${uid}`, {
        headers: {
            "iplanetDirectoryPro": token,
            "Content-Type": "application/json"
        }
    });
    if (200 === result.statusCode) {
        return result.data;
    }
}

export function isSingleSignOnEnabled() {
    return !process.env.SKIP_SSO;
}