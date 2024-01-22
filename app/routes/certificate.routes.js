const { authJwt } = require("../middleware");
const certificateController = require("../controllers/certificate.controller");

module.exports = function (app) {

     /* End Point to  create a certificate Record
        POST - /api/certificate API endpoint
        categoryController.createCertificate - Controller function to Create a categories record
    */
  app.post(
    "/api/certificate/",
     [authJwt.verifyToken],
    certificateController.createCertificate
  );

    /* End Point to  create a certificate Record
        GET - /api/certificate API endpoint
        categoryController.getCertificate - Controller function to Create a categories record
    */
  app.get(
    "/api/certificate/",
     [authJwt.verifyToken],
    certificateController.getCertificate
  );

   /* End Point to  create a certificate Record
        GET - /api/certificate:reg_id API endpoint
        categoryController.getCertificateById - Controller function to Create a categories record
    */
  app.get(
    "/api/certificate/:reg_id",
     [authJwt.verifyToken],
    certificateController.getCertificateById
  );

   /* End Point to  create a certificate Record
        PUT - /api/certificate:certificate_id API endpoint
        categoryController.updateCertificateById - Controller function to Create a categories record
    */
  app.put(
    "/api/certificate/:certificate_id",
     [authJwt.verifyToken],
    certificateController.updateCertificateById
  );
}