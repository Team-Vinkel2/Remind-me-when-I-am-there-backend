module.exports = function(params) {
    let data = params.data;

    return {
        name: 'remindersController',
        createReminderForUser(req, res) {
            let authToken = req.get('auth-token');
            let reminder = req.body;

            if (!authToken) {
                return res.status(400).send({ error: { message: 'Missing user identity!' } });
            }

            if (!reminder) {
                return res.status(400).send({ error: { message: 'No reminder to set!' } });
            }

            if (!reminder.to_username) {
                return res.status(400).send({ error: { message: 'No target user specified!' } });
            }

            if (!reminder.title ||
                !reminder.content ||
                !(reminder.date || reminder.location_name)) {
                return res.status(400).send({ error: { message: 'Invalid reminder to create!' } });
            }

            let filter = {
                username: reminder.to_username
            };

            return Promise
                .all([
                    data.getUserByAuthToken(authToken),
                    data.getUsersByFilter(JSON.stringify(filter))
                ])
                .then(result => {
                    let [
                        fromUserResponse,
                        toUserResponse
                    ] = result;

                    let fromUser = fromUserResponse.body;
                    let [toUser] = toUserResponse.body;

                    if (!fromUser || !fromUser._id) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    if (!toUser || !toUser._id) {
                        throw { error: { message: 'User with such username was not found' } };
                    }

                    return Promise.all([
                        data.checkIfUsersAreBuddies(fromUser, toUser),
                        fromUser,
                        toUser
                    ]);
                })
                .then(result => {
                    let [
                        usersAreBuddies,
                        fromUser,
                        toUser
                    ] = result;

                    if (!usersAreBuddies) {
                        throw { error: { message: 'You and the user are not buddies!' } };
                    }

                    let newReminder = {
                        from_username: fromUser.username,
                        from_id: fromUser._id,
                        to_username: toUser.username,
                        to_id: toUser._id,
                        title: reminder.title,
                        content: reminder.content,
                        date: reminder.date,
                        longitude: reminder.longitude,
                        latitude: reminder.latitude,
                        location_name: reminder.location_name,
                        accepted: false,
                        completed: false
                    };

                    return data.createReminder(newReminder);
                })
                .then(result => {
                    let createdReminder = result.body;
                    if (!createdReminder._id) {
                        throw { error: { message: 'Reminder was not created!' } };
                    }

                    return res.status(200).send(createdReminder);

                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        getMyReminders(req, res) {
            let authToken = req.get('auth-token');

            if (!authToken) {
                return res.status(400).send({ error: { message: 'Missing user identity!' } });
            }

            return data.getUserByAuthToken(authToken)
                .then(result => {
                    let user = result.body;

                    if (!user || !user._id || !user.username) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    let filter = {
                        to_username: user.username,
                        to_id: user._id
                    };

                    return data.getRemindersByFilter(filter);
                })
                .then(result => {
                    let reminders = result.body;

                    return res.status(200).send(reminders);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        getMyPendingReminders(req, res) {
            let authToken = req.get('auth-token');

            if (!authToken) {
                return res.status(400).send({ error: { message: 'Missing user identity!' } });
            }

            return data.getUserByAuthToken(authToken)
                .then(result => {
                    let user = result.body;

                    if (!user || !user._id || !user.username) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    let filter = {
                        to_username: user.username,
                        to_id: user._id,
                        accepted: false
                    };

                    return data.getRemindersByFilter(filter);
                })
                .then(result => {
                    let reminders = result.body;

                    return res.status(200).send(reminders);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        getReminder(req, res) {
            let authToken = req.get('auth-token');
            let reminderId = req.params.reminderId;

            console.log(reminderId);

            if (!authToken) {
                return res.status(400).send({ error: { message: 'Missing user identity!' } });
            }

            if (!reminderId) {
                return res.status(400).send({ error: { message: 'Reminder ID not provided' } });
            }

            return Promise
                .all([
                    data.getUserByAuthToken(authToken),
                    data.getReminderById(reminderId)
                ])
                .then(result => {

                    let [
                        userResoponse,
                        remindersMatchesResponse
                    ] = result;

                    let user = userResoponse.body;
                    let [reminder] = remindersMatchesResponse.body;

                    if (!user || !user._id || !user.username) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    if (!reminder || !reminder._id) {
                        throw { error: { message: 'Reminder does not exist' } };
                    }

                    if (reminder.to_username !== user.username ||
                        reminder.to_id !== user._id) {
                        throw { error: { message: 'This reminder is not yours!' } };
                    }

                    return res.status(200).send(reminder);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        }

    };
};