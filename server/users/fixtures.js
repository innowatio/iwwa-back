Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        countAdmins() === 0
    ) {
        insertAdmin();
    }
});

function countAdmins() {
    return Meteor.users.find({
        _id: "admin"
    }).count();
}

function insertAdmin() {
    Meteor.users.insert({
        _id: "admin",
        profile: {},
        groups: [
            "admin"
        ]
    });
}