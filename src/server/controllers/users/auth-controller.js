module.exports = function(params) {
    let data = params.data;

    return {
        name: 'authController',
        loginUser(req, res) {
            let user = req.body;

            return data.loginUser(user)
                .then(result => {
                    let body = result.body;
                    if (body.error) {
                        if (body.error === 'InvalidCredentials') {
                            throw { error: { message: 'Wrong username or password!' } };
                        } else if (body.error === 'EmailVerificationRequired') {
                            throw { error: { message: 'You must confirm your email first!' } };
                        } else {
                            throw { error: { message: 'Oops! Something went wrong. Try again!' } };
                        }
                    }
                    return res.status(200).send(body);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        registerUser(req, res) {
            let user = req.body;
            return data.registerUser(user)
                .then(result => {
                    let createdUser = result.body;
                    if (createdUser.error) {
                        if (createdUser.error === 'UserAlreadyExists') {
                            throw { error: { message: 'The username you requested is already taken!' } };
                        } else {
                            throw { error: { message: 'Oops! Something went wrong. Try again!' } };
                        }
                    }

                    let normifiedUser = {
                        username: createdUser.username,
                        email: createdUser.email,
                        first_name: createdUser.first_name
                    };

                    if (!createdUser._kmd ||
                        !createdUser._kmd.emailVerification ||
                        !createdUser._kmd.emailVerification.status ||
                        createdUser._kmd.emailVerification.status !== 'sent') {
                        normifiedUser.email_status = 'unknown';
                    } else {
                        normifiedUser.email_status = createdUser._kmd.emailVerification.status;
                    }


                    return Promise.all([data.createRelationshipMapForUser(createdUser), normifiedUser]);
                })
                .then(result => {
                    let [
                        buddiesResult,
                        createdUser
                    ] = result;

                    let buddies = buddiesResult.body.buddies;

                    createdUser.buddies = buddies;
                    return res.status(200).send(createdUser);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        },
        resetPasswordByEmail(req, res) {
            let email = req.body.email;
            if (!email) {
                return res.status(400).send({ error: { message: 'No email was provided!' } });
            }
            return data.resetPasswordByEmail(email)
                .then(result => {
                    return res.sendStatus(200);
                })
                .catch(err => {
                    return res.status(400).send(err);
                });
        }
    };
};