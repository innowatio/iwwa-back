Meteor.startup(function () {
    [
        "admin",
        "Amministratore di Sistema",
        "Gestore di Sistema",
        "Energy Manager",
        "Manager",
        "yousave",
        "Clens",
        "Data Science"
    ].forEach(function (roleName) {
        var role = {
            name: roleName
        };
        Meteor.roles.upsert(role, role);
    });
});
