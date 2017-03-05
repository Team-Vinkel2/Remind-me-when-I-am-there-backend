// const kinveyService = require('../shared/kinvey-service')();
const remindersCollection = 'reminders';

module.exports = function(options) {
    let kinveyService = options.kinveyService;

    return {
        createReminder(reminder) {
            return kinveyService.postCollection(remindersCollection, reminder);
        },
        getRemindersByFilter(filter) {
            return kinveyService.getCollection(remindersCollection, { filter: JSON.stringify(filter) });
        },
        getReminderById(id) {
            let filter = {
                _id: id
            };

            return kinveyService.getCollection(remindersCollection, { filter: JSON.stringify(filter) });
        },
        changeReminder(reminder) {
            return kinveyService.putCollection(remindersCollection, reminder);
        }
    };
};