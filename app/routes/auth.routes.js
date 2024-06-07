const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function(app) {
  /**
   * Endpoint for user signup.
   * Validates duplicate username or email and checks if roles exist.
   *
   * @param {String} "/api/auth/signup" - API endpoint path for user signup.
   * @param {Function[]} [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted] - Middleware functions.
   * @param {Function} controller.signup - Controller function to handle user signup.
   */
  app.post(
      '/api/auth/signup',
      [
        verifySignUp.checkMobileNumberExist,
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted,
      ],
      controller.signup,
  );

  /**
   * Endpoint for user signin.
   *
   * @param {String} "/api/auth/signin" - API endpoint path for user signin.
   * @param {Function} controller.signin - Controller function to handle user signin.
   */
  app.post('/api/auth/signin', controller.signin);

  app.post('/api/auth/checkUser',
    [
      verifySignUp.checkMobileNumberExist,
    ],
    controller.checkRolesOfUserUsingMobileNumber,
  )
};
