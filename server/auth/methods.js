import jwt from "jsonwebtoken";

const secret = "secret";

Meteor.methods({
    issueJWT: () => {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error("Login required");
        }

        const payload = {
            sub: userId
        };

        return jwt.sign(payload, secret);
    }
});