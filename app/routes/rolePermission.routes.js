const { authJwt } = require('../middleware');
const controller = require('../controllers/rolePermission.controller');

module.exports = function(app) {
    /**
     * Create new rolePermission Record
     */
    app.post('/api/rolePermission',
        [authJwt.verifyToken],
        controller.save,
    );
    /**
     * Update rolePermission Record
    */
    app.put('/api/rolePermission/:id',
        [authJwt.verifyToken],
        controller.update,
    );
    /**
     * Delete rolePermission Record
    */
    app.delete('/api/rolePermission/:id',
        [authJwt.verifyToken],
        controller.delete,
    );
    /**
     * Get All rolePermission Record
    */
    app.get('/api/rolePermission',
        [authJwt.verifyToken],
        controller.getAll,
    );
    /**
     * Get  rolePermission Record by id
    */
    app.get('/api/rolePermission/:id',
        [authJwt.verifyToken],
        controller.getById,
    );

    /**
   * Search rolePermission details by fieldName and  fieldValue from the database.
  */
    app.get('/api/rolePermission/search/:fieldName/:fieldValue',
        [authJwt.verifyToken],
        controller.search,
    );
};
