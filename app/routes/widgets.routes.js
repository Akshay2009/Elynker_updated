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

  // /**
  //  * Endpoint to update widgets details--
  //  * @param {String} '/api/widgets' - API endpoint path.
  //  * @param {Function[]} [authJwt.verifyToken],
  //  * @param {Function} Widgets.updateWidgets, - Controller function to update widgets details--**/

  // app.put("/api/widgets/:id", [authJwt.verifyToken], Widgets.updateWidgets);

  /**
   * Endpoint to save single widgets details--
   * @param {String} '/api/widgets/single' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.saveSingleWidgets, - Controller function to save single widgets details--**/

  app.post("/api/widgets/single", [authJwt.verifyToken], Widgets.saveSingleWidgets);


  /**
   * Endpoint to update single widgets details--
   * @param {String} '/api/widgets/single/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.updateSingleWidgets, - Controller function to update widgets details--**/

  app.put("/api/widgets/:id", [authJwt.verifyToken], Widgets.updateSingleWidgets);

  /**
   * Endpoint to delete single widgets details--
   * @param {String} '/api/widgets/single/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} Widgets.deleteSingleWidgets, - Controller function to delete widgets details--**/

  app.delete("/api/widgets/:id", [authJwt.verifyToken], Widgets.deleteSingleWidgets);

  app.get('/api/widgets/mobile', Widgets.getWidgetsForMobile);
};
