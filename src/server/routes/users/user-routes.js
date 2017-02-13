module.exports = function(app, controllers) {
    let auth = controllers.authController;
    app
        .post('/login', auth.loginUser)
        .post('/register', auth.registerUser)
        .post('/reset-password', auth.resetPasswordByEmail)
        // Get this shit out of here
        .post('/test-relationship-creation', auth._testRelationships);
};