const { authJwt } = require("../middleware");
const controller = require("../controllers/adminTools.controller");
const { uploadadmintoolsdetails } = require("../uploadUtils");

module.exports = function (app) {
  /**
   * Store tools details from Excel file to the database.
   */
  app.post(
    "/api/admin/tools",
    [authJwt.verifyToken],
    uploadadmintoolsdetails.single("file"), // Adjusted to use `single` instead of `fields`
    controller.uploadXLSX
  );
  /**
   * Endpoint to Get adminTools details--
   * @param {String} '/api/admin/tools/",' - API endpoint path.
   * @param {Function} controller.getAll, - Controller function to get admin tools details--**/

  app.get(
    "/api/admin/tools",
    //[authJwt.verifyToken],
    controller.getAll
  );
  /**
   * Endpoint to update adminTools details--
   * @param {String} '/api/admin/tools/:id",' - API endpoint path.
   * @param {Function} controller.update, - Controller function to update adminTools details--**/

  app.put("/api/admin/tools/:id", [authJwt.verifyToken], controller.update);
  /**
   * Endpoint to delete adminTools details--
   * @param {String} '/api/admin/tools/:id",' - API endpoint path.
   * @param {Function} controller.delete, - Controller function to delete admin tools details--**/

  app.delete("/api/admin/tools/:id", [authJwt.verifyToken], controller.delete);

  /**
   * Endpoint to Get By search adminTools details--
   * @param {String} '/api/admin/tools/search/:fieldName/:fieldValue",' - API endpoint path.
   * @param {Function} controller.search, - Controller function to get admin tools details--**/

  app.get(
    "/api/admin/tools/search/:fieldName/:fieldValue",
    [authJwt.verifyToken],
    controller.search
  );
};
