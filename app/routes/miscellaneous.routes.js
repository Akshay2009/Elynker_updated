const { authJwt } = require('../middleware');
const filterVendors = require('../controllers/miscellaneous.controller');


module.exports = function (app) {
    /**
 * Endpoint to get filter vendors details 
 * @param {String} '/api/vendors/:type/:location/:categoryId' - API endpoint path.
 * @param {Function[]} [authJwt.verifyToken,
 * @param {Function} Registration.getVendorsByFilter, - Controller function to get filter vendors details**/

    app.get(
        '/api/vendors/:type/',
        [authJwt.verifyToken],
        filterVendors.getVendorsByLocation,
    );
    /**
    * Get  Registration Records by type 0-for both b2b and freelancer,2-b2b, 3-freelancer
    */
    app.get(
        '/api/admin/vendors/:type',
        [authJwt.verifyToken],
        filterVendors.vendorsListingAdmin,
    )

  /**Endpoint to get filter vendors details By reg id
    * @param {String} '/api/admin/vendorDetails/:reg_id' - API endpoint path.
    * @param {Function[]} [authJwt.verifyToken,
    * @param {Function} filterVendors.getFreelancerProfileDetailsByRegId, - Controller function to get filter vendors details by Reg id
    * **/
   
    app.get(
        '/api/admin/vendorDetails/:reg_id',
        [authJwt.verifyToken],
        filterVendors.getFreelancerProfileDetailsByRegId,

    );
}