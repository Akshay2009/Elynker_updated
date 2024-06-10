const { authJwt } = require("../middleware");
const PrerequestCustomers = require("../controllers/prerequestCustomers.controller");

module.exports = function (app) {
  /**
   * Endpoint to save prerequestCustomers details--
   * @param {String} '/api/prerequestCustomers' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} PrerequestCustomers.savePrerequestCustomers, - Controller function to save prerequestCustomers details--**/

  app.post("/api/prerequestCustomers/", PrerequestCustomers.savePrerequestCustomers);

  /**
   * Endpoint to get all prerequestCustomers details--
   * @param {String} '/api/prerequestCustomers' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} PrerequestCustomers.getAll, - Controller function to get all prerequestCustomers details--**/

  app.get("/api/prerequestCustomers/", [authJwt.verifyToken], PrerequestCustomers.getAll);

  /**
   * Endpoint to get prerequestCustomers details by id--
   * @param {String} '/api/prerequestCustomers/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} PrerequestCustomers.getById, - Controller function to get prerequestCustomers details by id--**/

  app.get("/api/prerequestCustomers/:id", [authJwt.verifyToken], PrerequestCustomers.getById);

  /**
   * Endpoint to get prerequestCustomers details by search--
   * @param {String} '/api/prerequestCustomers/search/:fieldName/:fieldValue' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} PrerequestCustomers.search, - Controller function to get prerequestCustomers details by search--**/

  app.get("/api/prerequestCustomers/search/:fieldName/:fieldValue", [authJwt.verifyToken], PrerequestCustomers.search);


}