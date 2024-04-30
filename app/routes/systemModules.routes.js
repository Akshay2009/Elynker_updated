const { authJwt } = require("../middleware");
const systemModules = require("../controllers/systemModules.controller");

module.exports = function (app) {
  /**
   * Endpoint to save system modules details--
   * @param {String} "/api/systemmodules/" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  systemModules.saveSystemModules, - Controller function to save system modules details---**/

  app.post(
    "/api/systemmodules/",
    [authJwt.verifyToken],
    systemModules.saveSystemModules
  );

  /**
   * Endpoint to get system modules details by Id--
   * @param {String} "/api/systemmodules/:id" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  systemModules.getSystemModulesById, - Controller function to get system modules details by id---**/

  app.get(
    "/api/systemmodules/:id",
    [authJwt.verifyToken],
    systemModules.getSystemModulesById
  );

  /**
   * Endpoint to get all system modules details--
   * @param {String} "/api/systemmodules/" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  systemModules.getSystemModules, - Controller function to get all system modules details---**/

  app.get(
    "/api/systemmodules/",
    [authJwt.verifyToken],
    systemModules.getSystemModules
  );

  /**
   * Endpoint to put system modules details--
   * @param {String} "/api/systemmodules/:id" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  systemModules.updateSystemModules, - Controller function to put system modules details---**/

  app.put(
    "/api/systemmodules/:id",
    [authJwt.verifyToken],
    systemModules.updateSystemModules
  );

  /**
   * Endpoint to delete system modules details--
   * @param {String} "/api/systemmodules/:id" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  systemModules.deleteSystemModules, - Controller function to delete system modules details---**/

  app.delete(
    "/api/systemmodules/:id",
    [authJwt.verifyToken],
    systemModules.deleteSystemModules
  );
};
