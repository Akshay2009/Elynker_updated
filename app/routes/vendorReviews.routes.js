const { authJwt } = require("../middleware");
const vendorReviews = require("../controllers/vendorReviews.controller");
const { uploadReviewImage } = require("../uploadUtils");

module.exports = function (app) {
  /**
   * Endpoint to save vendor reviews details--
   * @param {String} "/api/reviews/vendors/" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  vendorReviews.saveVendorReviews, - Controller function to save vendor reviews details---**/

  app.post(
    "/api/reviews/vendors/",
    [authJwt.verifyToken],
    uploadReviewImage.fields([{ name: "image" }]),
    vendorReviews.saveVendorReviews
  );

  /**
   * Endpoint to get vendor reviews details--
   * @param {String} "/api/reviews/vendors/" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  vendorReviews.getVendorReviews, - Controller function to get vendor reviews details---**/

  app.get(
    "/api/reviews/vendors",
    [authJwt.verifyToken],
    vendorReviews.getVendorReviews
  );

  /**
   * Endpoint to get vendor reviews details by reg_id--
   * @param {String} "/api/reviews/vendors/:registrationId" - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken],
   * @param {Function}  vendorReviews.getVendorReviewsByRegId, - Controller function to get vendor reviews details by regId---**/

  app.get(
    "/api/reviews/vendors/:registrationId",
    [authJwt.verifyToken],
    vendorReviews.getVendorReviewsByRegId
  );

  app.delete(
    '/api/reviews/vendors',
    [authJwt.verifyToken],
    vendorReviews.deleteAll
  );
};
