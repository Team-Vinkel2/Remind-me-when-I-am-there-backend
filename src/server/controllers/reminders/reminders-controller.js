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

            Promise
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
                        return res.status(404).send({ error: { message: 'Your identity is invalid!' } });
                    }

                    if (!toUser || !toUser._id) {
                        return res.status(404).send({ error: { message: 'User with such username was not found' } });
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
                        return res.status(403).send({ error: { message: 'You and the user are not buddies!' } });
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
                        return res.status(400).send({ error: { message: 'Reminder was not created!' } });
                    }

                    return res.status(200).send(createdReminder);

                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        }
    };
};