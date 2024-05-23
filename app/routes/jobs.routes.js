const { authJwt } = require("../middleware");
const controller = require("../controllers/jobs.controller");

module.exports = function (app) {
  /**
   * Endpoint to save jobs details--
   * @param {String} '/api/jobs' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.saveJobs, - Controller function to save jobs details--**/

  app.post("/api/jobs", [authJwt.verifyToken], controller.saveJobs);

  /**
   * Endpoint to update jobs details--
   * @param {String} '/api/jobs/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken]
   * @param {Function} controller.updateJobs, - Controller function to update jobs details--**/

  app.put("/api/jobs/:id", [authJwt.verifyToken], controller.updateJobs);

  /**
   * Endpoint to delete jobs details--
   * @param {String} '/api/jobs/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.saveJobs, - Controller function to delete jobs details--**/

  app.delete("/api/jobs/:id", [authJwt.verifyToken], controller.deleteJobs);

  /**
   * Endpoint to get jobs details--
   * @param {String} '/api/jobs' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.getAllJobs, - Controller function to get jobs details--**/

  app.get("/api/jobs", controller.getAll);


  /**
   * Endpoint to get jobs details by id--
   * @param {String} '/api/jobs' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.getAllJobs, - Controller function to get jobs details--**/

  app.get("/api/jobs/:id", controller.getById);


  /**
   * Endpoint to get jobs details by search--
   * @param {String} '/api/jobs/search/:fieldName/:fieldValue' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.saveJobs, - Controller function to get jobs details by search--**/

  app.get("/api/jobs/search/:fieldName/:fieldValue", controller.search);
};
