// const kinveyService = require('../shared/kinvey-service')();


module.exports = function(options) {
    let kinveyService = options.kinveyService;

    return {
        registerUser(user) {
            return kinveyService.registerUser(user);
        },
        loginUser(user) {
            return kinveyService.loginUser(user);
        }
    };
};