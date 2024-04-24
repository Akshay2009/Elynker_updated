const { authJwt } = require("../middleware");
const filterVendors = require("../controllers/miscellaneous.controller");
const {uploadCardImage} = require('../uploadUtils');
  

module.exports = function (app) {
  /**
   * Endpoint to get filter vendors details
   * @param {String} '/api/vendors/:type/:location/:categoryId' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken,
   * @param {Function} Registration.getVendorsByFilter, - Controller function to get filter vendors details**/

  app.get(
    "/api/vendors/:type/",
    //[authJwt.verifyToken],
    filterVendors.getVendorsByLocation
  );
  /**
   * Get  Registration Records by type 0-for both b2b and freelancer,2-b2b, 3-freelancer
   */
  app.get(
    "/api/admin/vendors/:type",
    [authJwt.verifyToken],
    filterVendors.vendorsListingAdmin
  );

  /**Endpoint to get filter vendors details By reg id
   * @param {String} '/api/admin/vendorDetails/:reg_id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken,
   * @param {Function} filterVendors.getFreelancerProfileDetailsByRegId, - Controller function to get filter vendors details by Reg id
   *
   **/

  app.get(
    "/api/admin/vendorDetails/:reg_id",
    [authJwt.verifyToken],
    filterVendors.getFreelancerProfileDetailsByRegId
  );

  /**Endpoint to get vendors details By reg id
   * @param {String} '/api/vendorDetails/:reg_id' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken,
   * @param {Function}  filterVendors.getVendorByRegId, - Controller function to get filter vendors details by Reg id
   *
   **/
  app.get(
    "/api/vendorDetails/:reg_id",
    //[authJwt.verifyToken],
    filterVendors.getVendorByRegId
  );

  /**Endpoint to upload image **
   * @param {String} '/api/card/imageUpload' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken,
   * @param {Function}  filterVendors.miscellaneousImageUpload, -End Point to upload card images along with URL */
  app.post(
    "/api/card/imageUpload",
    [authJwt.verifyToken],
    uploadCardImage.fields([
        { name: 'image' },
      ]),
    filterVendors.cardImageUpload
  );

  /**Endpoint to get vendors freelancer details By reg id
 * @param {String} '/api/vendorDetails/freelancer/:reg_id' - API endpoint path.
 * @param {Function[]} [authJwt.verifyToken,
 * @param {Function}  filterVendors.getVendorFreelancerByRegId, - Controller function to get filter vendors freelancer details by Reg id
 *
 **/
  app.get(
    "/api/vendorDetails/freelancer/:reg_id",
    //[authJwt.verifyToken],
    filterVendors.getVendorFreelancerByRegId
  );
};
