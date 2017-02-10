module.exports = function(app, controllers) {

    app
        .post('/login', controllers.authController.loginUser)
        .post('/register', controllers.authController.registerUser);
};