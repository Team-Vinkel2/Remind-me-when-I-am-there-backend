module.exports = function(params) {
    let data = params.data;

    return {
        name: 'relationshipsController',
        sendBuddyRequest(req, res) {
            let authToken = req.get('auth-token');
            let toUserUsername = req.body.username;

            if (!authToken) {
                return res.status(403).send({ error: { message: 'Not authorized' } });
            }

            if (!toUserUsername) {
                return res.status(400).send({ error: { message: 'Requested user not provided' } });
            }
            let filter = {
                username: toUserUsername
            };

            return Promise
                .all([
                    data.getUserByAuthToken(authToken),
                    data.getUsersByFilter(JSON.stringify(filter))
                ]).then(result => {
                    let [
                        fromUserResponse,
                        toUserResponse
                    ] = result;

                    let fromUser = fromUserResponse.body;
                    let toUserMatches = toUserResponse.body;
                    let [toUser] = toUserMatches;

                    if (!fromUser || !fromUser._id) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    if (!toUser || !toUser._id) {
                        throw { error: { message: 'User with such username was not found' } };
                    }

                    if (fromUser._id === toUser._id && fromUser.username === toUser.username) {
                        throw { error: { message: 'You can\'t send a buddy request to yourself!' } };
                    }

                    return Promise.all([
                        data.checkIfUsersAreBuddies(fromUser, toUser),
                        data.checkIfBuddyRequestExistBetweenUsers(fromUser, toUser),
                        { fromUser, toUser }
                    ]);
                })
                .then(result => {
                    let [
                        usersAreBuddiesStatus,
                        buddyRequestExistStatus,
                        users
                    ] = result;

                    let {
                        fromUser,
                        toUser
                    } = users;

                    if (usersAreBuddiesStatus) {
                        throw { error: { message: 'You are already buddies with this user!' } };
                    }

                    if (buddyRequestExistStatus.exists) {
                        throw { error: { message: 'Buddy request for these two users exists!' } };
                    }

                    return data.createBuddyRequest(fromUser, toUser);
                })
                .then(result => {
                    if (result.error) {
                        throw { error: { message: 'Error creating buddy request' } };
                    }
                    return res.status(200).send(result);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        confirmBuddyRequest(req, res) {
            let authToken = req.get('auth-token');

            let buddyRequestId = req.body.id;

            if (!authToken) {
                return res.status(400).send({ error: { message: 'Auth token not provided' } });
            }
            if (!buddyRequestId) {
                return res.status(400).send({ error: { message: 'Buddy request ID not provided' } });
            }

            return Promise
                .all([
                    data.getUserByAuthToken(authToken),
                    data.getBuddyRequestById(buddyRequestId)
                ])
                .then(result => {
                    let [
                        userResult,
                        buddyRequest
                    ] = result;

                    let user = userResult.body;

                    if (!user || !user._id) {
                        throw { error: { message: 'Invalid auth token!' } };
                    }

                    if (!buddyRequest || !buddyRequest._id) {
                        throw { error: { message: 'Buddy request was not found!' } };
                    }

                    if (!(buddyRequest.to_username === user.username) || !(buddyRequest.to_id === user._id)) {
                        throw { error: { message: 'You cannot confirm that request. Invalid user identity' } };
                    }

                    let relationshipUsers = {
                        firstUser: {
                            _id: buddyRequest.from_id,
                            username: buddyRequest.from_username
                        },
                        secondUser: {
                            _id: buddyRequest.to_id,
                            username: buddyRequest.to_username
                        }
                    };

                    return Promise
                        .all([
                            data.createRelationshipBetweenUsers(relationshipUsers.firstUser, relationshipUsers.secondUser),
                            data.deleteBuddyRequest(buddyRequestId)
                        ]);
                })
                .then(result => {
                    let [usersRelationshipsCreatedStatus] = result;

                    if (!usersRelationshipsCreatedStatus) {
                        throw { error: { message: 'Unable to create relationship between users' } };
                    }
                    return res.sendStatus(200);

                })
                .catch(err => {
                    return res.status(400).send(err);
                });

        }
    };
};