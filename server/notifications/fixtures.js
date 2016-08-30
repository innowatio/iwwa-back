import {Random} from "meteor/random";

Meteor.startup(() => {
    if (
        process.env.ENVIRONMENT !== "production"
    ) {
        const users = Meteor.users.find({}).fetch();
        users.map(user => {
            const userId = user._id;
            const notification = JSON.parse(Assets.getText("fixtures/notifications/test-notification.json"));
            for (var index = 0; index < 10; index++) {
                const type = Random.choice(["alarm", "notification", "tip", "default"]);
                const userNotification = {
                    ...notification,
                    type,
                    readed: Random.fraction() < 0.5 ? true : false,
                    userId
                }
                Notifications.insert(userNotification);
            }
        });
    }
});
