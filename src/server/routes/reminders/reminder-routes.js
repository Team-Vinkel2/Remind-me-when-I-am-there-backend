module.exports = function(app, controllers) {
    let remindersController = controllers.remindersController;
    app
        .post('/create-reminder-for-buddy', remindersController.createReminderForUser)
        .get('/my-reminders', remindersController.getMyReminders)
        .get('/my-pending-reminders', remindersController.getMyPendingReminders)
        .get('/get-reminder/:reminderId', remindersController.getReminder)
        .put('/accept-reminder/:reminderId', remindersController.acceptReminder);
};