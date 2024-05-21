const { authJwt } = require("../middleware");
const controller = require("../controllers/personContacted.controller");

module.exports = function (app) {
  /* End Point to  post person contact
        GET - /api/products API endpoint
        productController.getAllProducts - Controller function to post person contact
    */

  app.post("/api/personcontacted/", controller.createPersonContacted);

  /* End Point to get person contact
        GET - /api/products API endpoint
        productController.getAllProducts - Controller function  to get person contact
    */

  app.get("/api/personcontacted/", [authJwt.verifyToken], controller.getAll);

  /* End Point to  get person contact by search
        GET - /api/products API endpoint
        productController.getAllProducts - Controller function  to  get person contact by search
    */
  app.get(
    "/api/personcontacted/search/:fieldName/:fieldValue",
    [authJwt.verifyToken],
    controller.search
  );
};
