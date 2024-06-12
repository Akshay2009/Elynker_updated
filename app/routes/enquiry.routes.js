const { authJwt } = require('../middleware');
const enquiryController = require('../controllers/enquiry.controller');

module.exports = function(app) {
    /**
     * Create new Enquiry Record
     */
    app.post('/api/enquiry',
        [authJwt.verifyToken],
        enquiryController.saveEnquiry,
    );

    /**
     * Update Enquiry Record
     */
    app.put('/api/enquiry/:id',
        [authJwt.verifyToken],
        enquiryController.updateEnquiry,
    );

    /**
     * Delete Enquiry Record
     */
    app.delete('/api/enquiry/:id',
        [authJwt.verifyToken],
        enquiryController.deleteEnquiry,
    );

    /**
     * Get All Enquiry Record
     */
    app.get('/api/enquiry',
        [authJwt.verifyToken],
        enquiryController.getAll,
    );

    /**
     * Get  Enquiry Record By Id
     */
    app.get('/api/enquiry/:id',
        [authJwt.verifyToken],
        enquiryController.getEnquiryById,
    );

    /**
     * Search Enquiry Record By fieldName and fieldValue
     */
    app.get('/api/enquiry/search/:fieldName/:fieldValue',
        [authJwt.verifyToken],
        enquiryController.search,
    );

    /**
    * Get  Enquiry Record By RegistrationId
    */
    app.get('/api/enquiry/vendor/:registrationId',
        [authJwt.verifyToken],
        enquiryController.getEnquiryByRegistrationId,
    );
    /**
    * Get  Enquiry Record By RegistrationId last 24 hours
    */
    app.get('/api/enquiry-check/:registrationId',
        [authJwt.verifyToken],
        enquiryController.getEnquirylast24hours,
    );

};
