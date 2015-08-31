Meteor.methods({
    getPasswordResetRedirectUrl: function () {
        return process.env.PASSWORD_RESET_REDIRECT_URL;
    }
});
