Meteor.methods({
    checkToken: checkToken
});

function checkToken () {
    var user = Meteor.user();

    const {innowatioToken} = user;
    const result = HTTP.post(`https://sso.innowatio.it/openam/json/sessions/${innowatioToken}?_action=validate`);

    if (200 != result.statusCode || false === result.data.valid) {
        return {
            error: new Meteor.Error(401, 'authentication-failed')
        };
    } else {
        return {
            userId: user._id
        }
    }
}