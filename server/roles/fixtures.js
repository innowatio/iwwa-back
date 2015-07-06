Meteor.startup(function () {
    [
        "admin",
        "Amministratore di Sistema",
        "Gestore di Sistema",
        "Energy Manager",
        "Manager"
    ].forEach(function (roleName) {
        var role = {
            name: roleName
        };
        Meteor.roles.upsert(role, role);
    });
});
