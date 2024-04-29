const { authJwt } = require('../middleware');
const requirementController = require('../controllers/requirement.controller');

module.exports = function(app) {
    /**
     * Create new Requirement Record
     */
    app.post('/api/customer/requirement',
        [authJwt.verifyToken],
        requirementController.saveRequirement,
    );

    /**
     * Update Requirement Record
     */
    app.put('/api/customer/requirement/:id',
        [authJwt.verifyToken],
        requirementController.updateRequirement,
    );

    /**
     * Delete Requirement Record
     */
    app.delete('/api/customer/requirement/:id',
        [authJwt.verifyToken],
        requirementController.deleteRequirement,
    );

    /**
     * Get  Requirement Record By Id
     */
    app.get('/api/customer/requirement/:id',
        [authJwt.verifyToken],
        requirementController.getRequirementById,
    );

    /**
     * Get All Requirement Record
     */
    app.get('/api/customer/requirement',
        [authJwt.verifyToken],
        requirementController.getAll,
    );

    /**
     * Search Enquiry Record By fieldName and fieldValue
     */
    app.get('/api/customer/requirement/search/:fieldName/:fieldValue',
        [authJwt.verifyToken],
        requirementController.search,
    );
};
