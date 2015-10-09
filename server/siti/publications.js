var sitiOptions = {
    fields: {
        idCoin: 1,
        pod: 1,
        societa: 1
    }
};

Meteor.publish("siti", function () {
   var user = Meteor.users.findOne({_id: this.userId});
   if (!user) {
       return null;
   }
   if (_.contains(user.roles, "admin")) {
       return Siti.find({}, sitiOptions);
   }
   if (!user.siti) {
       return null;
   }
   return Siti.find({
       _id: {
           $in: user.siti
       }
   }, sitiOptions);
});
