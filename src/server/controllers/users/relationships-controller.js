module.exports = function(params) {
    let data = params.data;

    return {
        name: 'relationshipsController',
        _testRelationships(req, res) {
            let firstUser = req.body.firstUser;
            let secondUser = req.body.secondUser;
            // console.log('========================');
            // console.log('REQUEST FROM CLIENT');
            // console.log('========================');
            // console.log(firstUser);
            // console.log('==============');
            // console.log(secondUser);
            // console.log('========================');
            // console.log('END REQUEST FROM CLIENT');
            // console.log('========================');
            data.createRelationshipBetweenUsers(firstUser, secondUser)
                .then(result => {
                    return res.status(200).json({ success: { message: 'Created relationship successfully' } });
                });
        },
        _testBuddyRequest(req, res) {
            let fromUser = req.body.fromUser;
            let toUser = req.body.toUser;

            data.createBuddyRequest(fromUser, toUser)
                .then(result => {
                    return res.status(200).send({ success: { message: 'Created buddy request successfully' } });
                });
        },
        sendBuddyRequest(req, res) {
            let authToken = req.get('auth-token');
            let toUserUsername = req.body.to_user ? req.body.to_user.username : req.body.to_user;

            if (!authToken) {
                return res.status(403).send({ error: { message: 'Not authorized' } });
            }

            if (!toUserUsername) {
                return res.status(400).send({ error: { message: 'Requested user not provided' } });
            }
            let filter = {
                username: toUserUsername
            };

            Promise
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
                        return res.status(404).send({ error: { message: 'Your identity is invalid!' } });
                    }

                    if (!toUser || !toUser._id) {
                        return res.status(404).send({ error: { message: 'User with such username was not found' } });
                    }

                    return Promise.all([
                        data.checkIfBuddyRequestExistBetweenUsers(fromUser, toUser),
                        { fromUser, toUser }
                    ]);
                })
                .then(result => {
                    let [
                        buddyRequestExistStatus,
                        users
                    ] = result;

                    let {
                        fromUser,
                        toUser
                    } = users;

                    if (buddyRequestExistStatus.exists) {
                        return res.status(200).send(buddyRequestExistStatus.buddyRequest);
                    }

                    return data.createBuddyRequest(fromUser, toUser);
                })
                .then(result => {
                    return res.status(200).send(result);
                });
        },
        confirmBuddyRequest(req, res) {
            let authToken = req.get('auth-token');

            let buddyRequestId = req.body.buddyRequest ? req.body.buddyRequest.id : req.body.buddyRequest;

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
                        return res.status(404).send({ error: { message: 'Invalid auth token!' } });
                    }

                    if (!buddyRequest || !buddyRequest._id) {
                        return res.status(404).send({ error: { message: 'Buddy request was not found!' } });
                    }

                    if (!(buddyRequest.to_username === user.username) || !(buddyRequest.to_id === user._id)) {
                        return res.status(403).send({ error: { message: 'You cannot confirm that request. Invalid user identity' } });
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
                    let [usersRelationships] = result;

                    return res.status(200).send(usersRelationships);
                });

        }
    };
};