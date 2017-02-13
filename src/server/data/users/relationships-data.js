// const kinveyService = require('../shared/kinvey-service')({});
const relationshipsCollection = 'relationships';

module.exports = function(options) {
    let kinveyService = options.kinveyService;

    return {
        createRelationshipMapForUser(user) {
            return Promise.resolve().then(() => {
                let body = {
                    user_id: user._id,
                    user_username: user.username,
                    buddies: []
                };
                return kinveyService.postCollection(relationshipsCollection, body);
            });
        }
    };
};