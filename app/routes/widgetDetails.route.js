const { authJwt } = require("../middleware");
const controller = require("../controllers/widgetDetails.controller");
const { uploadWidgetImage } = require("../uploadUtils");

module.exports = function (app) {
  /**
   * Endpoint to save widgets details--
   * @param {String} '/api/widgetDetails' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.save, - Controller function to save widgets details--**/

    app.post(
        "/api/widgetDetails",
        [authJwt.verifyToken],
        uploadWidgetImage.fields([{ name: "image" }]),
        controller.save
    );

    /**
   * Endpoint to update widgets details--
   * @param {String} '/api/widgetDetails/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.save, - Controller function to save widgets details--**/

    app.put(
        "/api/widgetDetails/:id",
        [authJwt.verifyToken],
        uploadWidgetImage.fields([{ name: "image" }]),
        controller.update
    );

    /**
   * Endpoint to Delete widgets details--
   * @param {String} '/api/widgetDetails/:id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function} controller.delete, - Controller function to save widgets details--**/

    app.delete(
        "/api/widgetDetails/:id",
        [authJwt.verifyToken],
        controller.delete
    );

    /**
   * Endpoint to Get all widgets details--
   * @param {String} '/api/widgetDetails/:id' - API endpoint path.
   * @param {Function} controller.getAll, - Controller function to save widgets details--**/

    app.get(
        "/api/widgetDetails",
        controller.getAll
    );

    /**
   * Endpoint to Get By id widgets details--
   * @param {String} '/api/widgetDetails/:id' - API endpoint path.
   * @param {Function} controller.getAll, - Controller function to save widgets details--**/

    app.get(
        "/api/widgetDetails/:id",
        controller.getById
    );

     /**
   * Endpoint to Get By search widgets details--
   * @param {String} '/api/widgetDetails/:id' - API endpoint path.
   * @param {Function} controller.getAll, - Controller function to save widgets details--**/

     app.get(
        "/api/widgetDetails/search/:fieldName/:fieldValue",
        [authJwt.verifyToken],
        controller.search
    );
};