module.exports = function(app, controllers) {
    let usersController = controllers.usersController;

    app
        .get('/search-users/:partialName', usersController.findUserByPartialName);
};