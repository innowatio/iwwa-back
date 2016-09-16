Meteor.startup(function () {
    JSON.parse(Assets.getText("fixtures/roles/roles.json")).forEach(function (roleName) {
        var role = {
            name: roleName
        };
        Meteor.roles.upsert(role, role);
    });
});
