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
                    return res.sendStatus(200);
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

        },
        checkStatusBetweenUsers(req, res) {
            let authToken = req.get('auth-token');
            let toUserUsername = req.body.user_username;

            if (!authToken) {
                return res.status(403).send({ error: { message: 'Not authorized' } });
            }

            if (!toUserUsername) {
                return res.status(400).send({ error: { message: 'Requested user not provided' } });
            }
            let filter = {
                username: toUserUsername
            };

            let usersStatus = {
                status: 'unrelated'
            };

            return Promise
                .all([
                    data.getUserByAuthToken(authToken),
                    data.getUsersByFilter(JSON.stringify(filter))
                ]).then(result => {
                    let [
                        firstUserResponse,
                        secondResponse
                    ] = result;

                    let fromUser = firstUserResponse.body;
                    let toUserMatches = secondResponse.body;
                    let [toUser] = toUserMatches;

                    if (!fromUser || !fromUser._id) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    if (!toUser || !toUser._id) {
                        throw { error: { message: 'User with such username was not found' } };
                    }

                    if (fromUser._id === toUser._id && fromUser.username === toUser.username) {
                        throw { error: { message: 'Pretty sure you are friends with yourself' } };
                    }

                    return Promise.all([
                        data.checkIfUsersAreBuddies(fromUser, toUser),
                        { fromUser, toUser }
                    ]);
                })
                .then((result => {

                    let [
                        usersAreBuddies,
                        users
                    ] = result;

                    if (usersAreBuddies) {
                        usersStatus.status = 'buddies';
                        res.status(200).send(usersStatus);
                        throw { responseSent: true };
                    } else {
                        return Promise.all([
                            data.checkIfBuddyRequestExistBetweenUsers(users.fromUser, users.toUser),
                            users
                        ]);
                    }
                }))
                .then(result => {
                    let [
                        buddyRequestExistsStatus,
                        users
                    ] = result;

                    if (buddyRequestExistsStatus.exists) {
                        if (buddyRequestExistsStatus.buddyRequest.from_username === users.fromUser.username &&
                            buddyRequestExistsStatus.buddyRequest.from_id === users.fromUser._id) {
                            usersStatus.status = 'sent';
                        } else if (buddyRequestExistsStatus.buddyRequest.from_username === users.toUser.username &&
                            buddyRequestExistsStatus.buddyRequest.from_id === users.toUser._id) {
                            usersStatus.status = 'received';
                            usersStatus.request_id = buddyRequestExistsStatus.buddyRequest._id;
                        }
                        res.status(200).send(usersStatus);
                        throw { responseSent: true };
                    }

                    return res.status(200).send(usersStatus);
                })
                .catch(err => {
                    if (err.responseSent) {
                        return;
                    }
                    return res.status(400).send(err);
                });
        },
        getBuddies(req, res) {
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

                    return data.getRelationshipsForUser(user);
                })
                .then(result => {
                    let foundRelationshipMaps = result.body;
                    let [
                        foundRelationshipMap
                    ] = foundRelationshipMaps;

                    if (!foundRelationshipMap) {
                        throw { error: { message: 'No relations map found' } };
                    }

                    let buddies = [];

                    if (foundRelationshipMap.buddies) {
                        buddies = foundRelationshipMap.buddies;
                    }

                    return res.status(200).send(buddies);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        getBuddyRequests(req, res) {
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

                    return data.getBuddyRequstsForUser(user);
                })
                .then(result => {
                    if (!result) {
                        throw { error: { message: 'Error while fetching buddy requests' } };
                    }

                    return res.status(200).send(result);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        }
    };
};