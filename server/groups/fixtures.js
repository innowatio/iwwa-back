Meteor.startup(() => {
    if (Groups.find().count() === 0) {
        JSON.parse(Assets.getText("fixtures/groups/admin.json")).map(groupName => {
            const group = {
                name: groupName,
                roles: JSON.parse(Assets.getText("fixtures/roles/roles.json"))
            };
            Groups.insert(group);
        });
        JSON.parse(Assets.getText("fixtures/groups/groups.json")).map(group => {
            Groups.insert(group);
        });
    }
});
