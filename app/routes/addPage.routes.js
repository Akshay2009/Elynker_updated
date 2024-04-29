const { authJwt } = require('../middleware');
const controller = require('../controllers/addPage.controller');

module.exports = function(app) {
    /**
     * Create new AddPage Record
     */
    app.post('/api/page',
        [authJwt.verifyToken],
        controller.save,
    );

    /**
     * Update AddPage Record
     */
    app.put('/api/page/:id',
        [authJwt.verifyToken],
        controller.update,
    );

    /**
     * Delete AddPage Record
     */
    app.delete('/api/page/:id',
        [authJwt.verifyToken],
        controller.delete,
    );

    /**
     * Get  AddPage Record By Id
     */
    app.get('/api/page/:id',
        [authJwt.verifyToken],
        controller.getById,
    );

    /**
     * Get All AddPage Record
     */
    app.get('/api/page',
        [authJwt.verifyToken],
        controller.getAll,
    );

    /**
     * Search AddPage Record By fieldName and fieldValue
     */
    app.get('/api/page/search/:fieldName/:fieldValue',
        [authJwt.verifyToken],
        controller.search,
    );
};
