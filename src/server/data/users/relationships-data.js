// const kinveyService = require('../shared/kinvey-service')({});
const relationshipsCollection = 'relationships';
const buddyRequestsCollection = 'buddyrequests';

module.exports = function(options) {
    let kinveyService = options.kinveyService;

    return {
        createRelationshipMapForUser(user) {
            return Promise.resolve().then(() => {
                let body = {
                    user_id: user._id,
                    user_username: user.username,
                    buddies: []
                };
                return kinveyService.postCollection(relationshipsCollection, body);
            });
        },
        createRelationshipBetweenUsers(firstUser, secondUser) {
            let promise =
                new Promise((resolve, reject) => {

                    // console.log('========================');
                    // console.log('CREATING RELATIONSHIP INIT USERS');
                    // console.log('========================');
                    // console.log(firstUser);
                    // console.log('==============');
                    // console.log(secondUser);
                    // console.log('========================');
                    // console.log('END');
                    // console.log('========================');

                    if (!firstUser._id || !firstUser.username || !secondUser._id || !secondUser.username) {
                        return reject({ error: { message: 'Id/username for BOTH users was not presented' } });
                    }

                    let filterFirstUser = {
                        $and: [{
                            user_id: firstUser._id,
                            user_username: firstUser.username
                        }]
                    };

                    let filterSecondUser = {
                        $and: [{
                            user_id: secondUser._id,
                            user_username: secondUser.username
                        }]
                    };

                    // console.log('========================');
                    // console.log('Filters');
                    // console.log('========================');
                    // console.log(filterFirstUser);
                    // console.log('==============');
                    // console.log(filterSecondUser);
                    // console.log('========================');
                    // console.log('END');
                    // console.log('========================');

                    resolve(Promise.all([
                        kinveyService.getCollection(relationshipsCollection, { filter: JSON.stringify(filterFirstUser) }),
                        kinveyService.getCollection(relationshipsCollection, { filter: JSON.stringify(filterSecondUser) })
                    ]));
                })
                .then(result => {
                    let [
                        firstUserResponse,
                        secondUserResponse
                    ] = result;



                    let [firstUserRelationships] = firstUserResponse.body;
                    let [secondUserRelationships] = secondUserResponse.body;
                    // console.log('========================');
                    // console.log('CURRENT REALTIONSHIPS FOR USERS');
                    // console.log('========================');
                    // console.log(firstUserRelationships);
                    // console.log('==============');
                    // console.log(secondUserRelationships);
                    // console.log('========================');
                    // console.log('END');
                    // console.log('========================');

                    let firstUserBuddies = firstUserRelationships.buddies;
                    let secondUserBuddies = secondUserRelationships.buddies;

                    if (firstUserBuddies.indexOf(secondUser.username) === -1) {
                        firstUserBuddies.push(secondUser.username);
                    }

                    if (secondUserBuddies.indexOf(firstUser.username) === -1) {
                        secondUserBuddies.push(firstUser.username);
                    }

                    firstUserRelationships.buddies = firstUserBuddies;
                    secondUserRelationships.buddies = secondUserBuddies;

                    return Promise.all([
                        kinveyService.putCollection(relationshipsCollection, firstUserRelationships, { id: firstUserRelationships._id }),
                        kinveyService.putCollection(relationshipsCollection, secondUserRelationships, { id: secondUserRelationships._id })
                    ]);
                })
                .then(result => {
                    let [
                        firstUserRelationshipsResponse,
                        secondUserRelationshipsResponse
                    ] = result;

                    let firstUserRelationships = firstUserRelationshipsResponse.body;
                    let secondUserRelationships = secondUserRelationshipsResponse.body;
                    // console.log('========================');
                    // console.log('CHANGED REALTIONSHIPS FOR USERS');
                    // console.log('========================');
                    // console.log(firstUserRelationships);
                    // console.log('==============');
                    // console.log(secondUserRelationships);
                    // console.log('========================');
                    // console.log('END');
                    // console.log('========================');

                    if (!firstUserRelationships._id || !secondUserRelationships._id) {
                        throw { error: { message: 'Error while creating relationship' } };
                    }

                    return true;
                });

            return promise;
        },
        createBuddyRequest(fromUser, toUser) {
            let promise =
                new Promise((resolve, reject) => {
                    if (!fromUser._id || !fromUser.username || !toUser._id || !toUser.username) {
                        reject({ error: { message: 'Not enough info was provided' } });
                    }

                    let buddyRequest = {
                        from_id: fromUser._id,
                        from_username: fromUser.username,
                        to_id: toUser._id,
                        to_username: toUser.username
                    };

                    resolve(kinveyService.postCollection(buddyRequestsCollection, buddyRequest));
                })
                .then(result => {
                    let entry = result.body;

                    return entry;
                });

            return promise;
        },
        checkIfUsersAreBuddies(firstUser, secondUser) {
            let promise = new Promise((resolve, reject) => {
                if (!firstUser._id || !firstUser.username || !secondUser._id || !secondUser.username) {
                    return reject({ error: { message: 'Id/username for BOTH users was not presented' } });
                }

                let firstUserRelationshipsFilter = {
                    user_id: firstUser._id,
                    user_username: firstUser.username
                };

                let secondUserRelationshipsFilter = {
                    user_id: secondUser._id,
                    user_username: secondUser.username
                };

                resolve(Promise.all([
                    kinveyService.getCollection(relationshipsCollection, { filter: JSON.stringify(firstUserRelationshipsFilter) }),
                    kinveyService.getCollection(relationshipsCollection, { filter: JSON.stringify(secondUserRelationshipsFilter) })
                ]));
            }).then(result => {
                let [
                    firstUserRelationshipsResponse,
                    secondUserRelationshipsResponse
                ] = result;

                let [firstUserRelationships] = firstUserRelationshipsResponse.body;
                let [secondUserRelationships] = secondUserRelationshipsResponse.body;

                if (!firstUserRelationships._id || !secondUserRelationships._id) {
                    return false;
                }

                let firstUserIsBuddy = false;
                let secondUserIsBuddy = false;

                if (firstUserRelationships.buddies.indexOf(secondUser.username) >= 0) {
                    firstUserIsBuddy = true;
                }

                if (secondUserRelationships.buddies.indexOf(firstUser.username) >= 0) {
                    secondUserIsBuddy = true;
                }

                return firstUserIsBuddy && secondUserIsBuddy;

            });

            return promise;
        },
        checkIfBuddyRequestExistBetweenUsers(firstUser, secondUser) {
            let promise = new Promise((resolve, reject) => {

                if (!firstUser._id || !firstUser.username || !secondUser._id || !secondUser.username) {
                    return reject({ error: { message: 'Id/username for BOTH users was not presented' } });
                }

                let requestFilter = {
                    $or: [{
                        from_id: firstUser._id,
                        from_username: firstUser.username,
                        to_id: secondUser._id,
                        to_username: secondUser.username
                    }, {
                        from_id: secondUser._id,
                        from_username: secondUser.username,
                        to_id: firstUser._id,
                        to_username: firstUser.username
                    }]
                };

                resolve(kinveyService.getCollection(buddyRequestsCollection, { filter: JSON.stringify(requestFilter) }));
            }).then(result => {
                let [buddyRequest] = result.body;

                if (!buddyRequest || !buddyRequest._id) {
                    return { exists: false, buddyRequest: '' };
                }

                return { exists: true, buddyRequest };
            });

            return promise;
        },
        getBuddyRequstsForUser(user) {
            let filter = {
                to_username: user.username,
                to_id: user._id
            };

            return kinveyService.getCollection(buddyRequestsCollection, { filter: JSON.stringify(filter) })
                .then(result => {
                    let buddyRequests = result.body;
                    return buddyRequests;
                });
        },
        getBuddyRequestById(id) {
            let filter = {
                _id: id
            };

            return kinveyService.getCollection(buddyRequestsCollection, { filter: JSON.stringify(filter) })
                .then(result => {
                    let buddyRequests = result.body;
                    let [buddyRequest] = buddyRequests;
                    return buddyRequest;
                });
        },
        deleteBuddyRequest(id) {
            return kinveyService.deleteFromCollection(buddyRequestsCollection, id);
        },
        getRelationshipsForUser(user) {
            let filter = {
                user_id: user._id,
                user_username: user.username
            };

            return kinveyService.getCollection(relationshipsCollection, { filter: JSON.stringify(filter) });
        }
    };
};