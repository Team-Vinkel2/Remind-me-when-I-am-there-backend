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
                    return res.status(200).json({ message: 'Created relationship successfully' });
                });
        },
        _testBuddyRequest(req, res) {
            let fromUser = req.body.fromUser;
            let toUser = req.body.toUser;

            data.createBuddyRequest(fromUser, toUser)
                .then(result => {
                    return res.status(200).send({ message: 'Created buddy request successfully' });
                });
        },
        sendBuddyRequest(req, res) {
            let authToken = req.get('auth-token');
            let toUserUsername = req.body.to_user ? req.body.to_user.username : req.body.to_user;

            if (!authToken) {
                return res.status(403).send({ message: 'Not authorized' });
            }

            if (!toUserUsername) {
                return res.status(400).send({ message: 'Requested user not provided' });
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
                        return res.status(404).send({ message: 'Your identity is invalid!' });
                    }

                    if (!toUser || !toUser._id) {
                        return res.status(404).send({ message: 'User with such username was not found' });
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
        }
    };
};