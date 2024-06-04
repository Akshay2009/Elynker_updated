const { authJwt } = require("../middleware");
const controller = require("../controllers/qrContacts.controller");

module.exports = function (app) {
  /* End Point to  post person contact
        GET - /api/qrcontacted API endpoint
        controller.createPersonContacted - Controller function to post qr contact
    */

  app.post("/api/qrcontacted/", controller.createPersonContacted);

  /* End Point to get person contact
        GET - /api/products API endpoint
        controller.getAll - Controller function  to get qr contact
    */

  app.get("/api/qrcontacted/", [authJwt.verifyToken], controller.getAll);

  /* End Point to  get person contact by search
        GET - /api/products API endpoint
        productController.getAllProducts - Controller function  to  get qr contact by search
    */
  app.get(
    "/api/qrcontacted/search/:fieldName/:fieldValue",
    [authJwt.verifyToken],
    controller.search
  );
};
