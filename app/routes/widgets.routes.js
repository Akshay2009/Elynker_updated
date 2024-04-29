const { authJwt } = require("../middleware");
const Widgets = require("../controllers/widgets.controller");

module.exports = function (app) {
  /**
   * Endpoint to save widgets details--
   * @param {String} '/api/widgets' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.saveWidgets, - Controller function to save widgets details--**/

  app.post("/api/widgets", [authJwt.verifyToken], Widgets.saveWidgets);

  /**
   * Endpoint to get widgets details--
   * @param {String} '/api/widgets' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.getWidgets, - Controller function to get widgets details--**/

  app.get("/api/widgets", /*[authJwt.verifyToken]*/ Widgets.getWidgets);

  /**
   * Endpoint to update widgets details--
   * @param {String} '/api/widgets' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.updateWidgets, - Controller function to update widgets details--**/

  app.put("/api/widgets/:id", [authJwt.verifyToken], Widgets.updateWidgets);

};
