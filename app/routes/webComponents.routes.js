const { authJwt } = require("../middleware");
const controller = require("../controllers/webComponents.controller");

module.exports = function (app) {
  /**
   * Endpoint to save WebComponent details--
   * @param {String} '/api/WebComponent' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.saveWebComponents, - Controller function to save WebComponent details--**/

  app.post(
    "/api/webcomponents/",
    [authJwt.verifyToken],
    controller.saveWebComponents
  );

  /**
   * Endpoint to get all WebComponent details--
   * @param {String} '/api/WebComponent' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.getAllWebComponents, - Controller function to get all WebComponent details--**/

  app.get(
    "/api/webcomponents/",
    // [authJwt.verifyToken],
    controller.getAll
  );

  /**
   * Endpoint to update WebComponent details--
   * @param {String} '/api/WebComponent/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.updateWebComponent, - Controller function to update WebComponent details--**/

  app.put(
    "/api/webcomponents/:id",
    [authJwt.verifyToken],
    controller.updateWebComponent
  );

  /**
   * Endpoint to delete WebComponent details--
   * @param {String} '/api/WebComponent/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.deleteWebComponent, - Controller function to delete WebComponent details--**/

  app.delete(
    "/api/webcomponents/:id",
    [authJwt.verifyToken],
    controller.deleteWebComponent
  );

  /**
   * Endpoint to get WebComponent details by search--
   * @param {String} '/api/WebComponent' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.search, - Controller function to get WebComponent details by search--**/

  app.get(
    "/api/webcomponents/search/:fieldName/:fieldValue",
    // [authJwt.verifyToken],
    controller.search
  );
};
