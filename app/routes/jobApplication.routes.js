const { authJwt } = require('../middleware');
const {
  uploadJobApplication,
  handleMulterError,
} = require('../uploadUtils');
const controller = require('../controllers/jobApplication.controller');


module.exports = function(app) {
  /**
   * Endpoint to job applications.
   * @param {String} '/api/job-application' - API endpoint path.
   * @param {Function[]} [authJwt.verifyToken,
   * @param {Function}freelancerResumeController.uploadFreelancerResume - Controller function to handle the upload resume.
   */
  app.post(
      '/api/job-application',
      [authJwt.verifyToken],
      uploadJobApplication.fields([{ name: 'resume',maxCount: 1  }, { name: 'cover_letter',maxCount: 1  }]),
      handleMulterError,
      controller.save,
  );

  app.get('/api/job-application/search/:fieldName/:fieldValue',
    [authJwt.verifyToken],
    controller.search,
  );

  
};
