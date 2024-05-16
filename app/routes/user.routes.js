const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');

module.exports = function(app) {
/**
 * Update user details by user ID from the database.
 *
 */
  app.put('/api/users/:id',
      [authJwt.verifyToken],
      controller.updateUser,
  );

  /**
 * Retrieve user details by user ID from the database.
 *
 */
  app.get('/api/users/:id',
      [authJwt.verifyToken],
      controller.getUserById,
  );
  /**
 * delete user details by user ID from the database.
 *
 */
  app.delete('/api/users/:id',
      [authJwt.verifyToken],
      controller.delUserById,
  );

  /**
   * Search user details by fieldName and  fieldValue from the database.
  */
  app.get('/api/users/search/:fieldName/:fieldValue',
      [authJwt.verifyToken],
      controller.search,
  );

  /**
 * Get all user details from the database.
 *
 */
  app.get('/api/users/',
      [authJwt.verifyToken],
      controller.getAllUser,
  );
  /**
   * Users Created By Admin
 */  
  app.post('/api/admin/users',
        [authJwt.verifyToken],
        controller.userCreateByAdmin,
  );
  /**
   * Users Updated By Admin
 */  
  app.put('/api/admin/users/:id',
        [authJwt.verifyToken],
        controller.updateUserByAdminById,
  );

  /**
   * Users Delete By Admin
 */  
  app.delete('/api/admin/users/:id',
        [authJwt.verifyToken],
        controller.deleteUserByAdminById,
  );

    app.put('/api/users/addRole/:userId',
        [authJwt.verifyToken],
        controller.addRoleToUser,
    );

    app.put('/api/users/setRole/:userId',
        [authJwt.verifyToken],
        controller.setRoleToUser,
    );
};
