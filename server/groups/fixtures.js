Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production" &&
        Groups.find().count() === 0
    ) {
        JSON.parse(Assets.getText("fixtures/groups/groups.json")).map(groupName => {
            const group = {
                name: groupName,
                roles: JSON.parse(Assets.getText("fixtures/roles/roles.json"))
            };
            Groups.insert(group);
        });
    }
});
