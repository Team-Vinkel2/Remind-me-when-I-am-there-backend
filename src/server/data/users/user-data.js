// const kinveyService = require('../shared/kinvey-service')({});

module.exports = function(options) {
    let kinveyService = options.kinveyService;

    return {
        getUserById(id) {
            return Promise.resolve()
                .then(() => {
                    let filter = {
                        _id: id
                    };

                    return kinveyService.getUsersByFilter(JSON.stringify(filter));
                })
                .then(users => {
                    let [user] = users;
                    return user;
                });
        },
        getUserByFilter(filter) {
            return Promise.resolve()
                .then(() => {
                    return kinveyService.getUsersByFilter(filter);
                });
        }
    };
};