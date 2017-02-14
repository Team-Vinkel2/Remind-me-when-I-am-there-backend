module.exports = function(app, controllers) {
    let relationshipsController = controllers.relationshipsController;
    app
        .post('/test-relationship-creation', relationshipsController._testRelationships)
        .post('/test-create-buddy-request', relationshipsController._testBuddyRequest)
        .post('/send-buddy-request', relationshipsController.sendBuddyRequest);
};