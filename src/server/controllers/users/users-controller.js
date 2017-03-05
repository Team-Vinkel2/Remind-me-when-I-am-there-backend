module.exports = function(params) {
    let data = params.data;

    return {
        name: 'usersController',
        findUserByPartialName(req, res) {
            let authToken = req.get('auth-token');
            let partialName = req.params.partialName;

            if (!authToken) {
                return res.status(403).send({ error: { message: 'Not authorized' } });
            }

            if (!partialName) {
                return res.status(400).send({ error: { message: 'Seach term not provided' } });
            }

            return data.getUserByAuthToken(authToken)
                .then(result => {
                    let user = result.body;

                    if (!user || !user._id || !user.username) {
                        throw { error: { message: 'Your identity is invalid!' } };
                    }

                    let filter = {
                        username: {
                            $regex: `^(?i)${partialName}`
                        }
                    };

                    return data.getUsersByFilter(JSON.stringify(filter));
                })
                .then(result => {
                    let users = result.body;
                    let usersToSend = [];

                    for (let user of users) {
                        let formattedUser = {
                            username: user.username,
                            first_name: user.first_name
                        };

                        if (!user.username) {
                            continue;
                        }

                        if (!user.first_name) {
                            formattedUser.first_name = 'Unknown';
                        }

                        usersToSend.push(formattedUser);
                    }

                    return res.status(200).send(usersToSend);

                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        }
    };
};