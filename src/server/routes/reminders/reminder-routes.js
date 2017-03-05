module.exports = function(app, controllers) {
    let remindersController = controllers.remindersController;
    app
        .post('/create-reminder-for-buddy', remindersController.createReminderForUser);
};