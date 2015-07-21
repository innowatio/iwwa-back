var resetPasswordHtmlTemplate = _.template(
    Assets.getText("email-templates/forgot-password.html")
);
Accounts.emailTemplates.siteName = "Iwwa";
Accounts.emailTemplates.from = "Iwwa Admin <paolo.scanferla@mondora.com>";
Accounts.emailTemplates.resetPassword.html = function (user, url) {
    return resetPasswordHtmlTemplate({
        url: url
    });
};
