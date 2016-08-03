function isSurveyCompleted (questions, user) {
    const selectedSurvey = user.surveys.find(survey => {
        return _.isEqual(survey.id, questions._id);
    }) || {};
    return selectedSurvey.completed;
}

Meteor.publish("questions", function ({type, category}) {
    var user = Meteor.users.findOne({_id: this.userId});
    if (!user) {
       return null;
    }
    if (_.isEqual(type, "survey")) {
        const day = moment().toISOString();
        const query = {
            type,
            start: {
                $lte: day
            },
            end: {
                $gte: day
            }
        };
        const questions = Questions.findOne(query) || {};
        if (!user.surveys || (!_.isEmpty(questions) && !isSurveyCompleted(questions, user))) {
            return Questions.find({_id: questions._id});
        }
        return null;
    }
    return Questions.find({type, category});
});
