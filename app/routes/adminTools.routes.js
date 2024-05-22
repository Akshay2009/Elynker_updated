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

  app.get(
    "/api/admin/tools",
    //[authJwt.verifyToken],
    controller.getAll
  );


  app.put(
    "/api/admin/tools/:id",
    [authJwt.verifyToken],
    controller.update
  );

  app.delete(
    "/api/admin/tools/:id",
    [authJwt.verifyToken],
    controller.delete
  );
};
