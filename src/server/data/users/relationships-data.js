// const kinveyService = require('../shared/kinvey-service')({});
const relationshipsCollection = 'relationships';

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
                        return reject('Id/username for BOTH users was not presented');
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



                    let [firstUserRelationships] = firstUserResponse.response.body;
                    let [secondUserRelationships] = secondUserResponse.response.body;
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

                    let firstUserRelationships = firstUserRelationshipsResponse.response.body;
                    let secondUserRelationships = secondUserRelationshipsResponse.response.body;
                    // console.log('========================');
                    // console.log('CHANGED REALTIONSHIPS FOR USERS');
                    // console.log('========================');
                    // console.log(firstUserRelationships);
                    // console.log('==============');
                    // console.log(secondUserRelationships);
                    // console.log('========================');
                    // console.log('END');
                    // console.log('========================');

                    return '';
                });

            return promise;
        }
    };
};