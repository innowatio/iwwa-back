// Localize in Italian
accountsUIBootstrap3.setLanguage("it");

// Redirect on successful reset
var redirectUrl;
Meteor.call("getPasswordResetRedirectUrl", function (error, url) {
    redirectUrl = url;
});
Template._resetPasswordDialog.events({
    "click #login-buttons-dismiss-reset-password-success": function () {
        window.location = redirectUrl;
    }
});

// Change page title if we're on the reset-password page
Accounts.onResetPasswordLink(function () {
    document.title = "Password reset";
});
