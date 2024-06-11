const { authJwt } = require("../middleware");
const controller = require("../controllers/subscription.controller");

module.exports = function (app) {
  /**
   * Endpoint to save subscription details--
   * @param {String} '/api/subscription/' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.save, - Controller function to save subscription details--**/

  app.post("/api/subscription", [authJwt.verifyToken], controller.save);

  /**
   * Endpoint to update subscription details--
   * @param {String} '/api/subscription/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.update, - Controller function to update subscription details--**/

  app.put("/api/subscription/:subscriptionDetailId",  controller.update);

  /**
   * Endpoint to delete subscription details--
   * @param {String} '/api/subscription/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.delete, - Controller function to delete subscription details--**/

  app.delete("/api/subscription/:id", [authJwt.verifyToken], controller.delete);

  /**
   * Endpoint to get all subscription details--
   * @param {String} '/api/subscription/' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.getAll, - Controller function to get all subscription details--**/

  app.get("/api/subscription", [authJwt.verifyToken], controller.getAll);

  /**
   * Endpoint to get subscription details by search--
   * @param {String} '/api/subscription/' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.search, - Controller function to get subscription details by search--**/

  app.get("/api/subscription/search/:fieldName/:fieldValue", [authJwt.verifyToken], controller.search);


  /**
   * Endpoint to get subscription details by ID--
   * @param {String} '/api/subscription/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.getById, - Controller function to get subscription details by id--**/

  app.get("/api/subscription/:id", [authJwt.verifyToken], controller.getById);

};