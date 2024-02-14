// routeInitializer.js
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const registrationRoutes = require("../routes/registration.routes");
const productRoutes = require("../routes/product.routes");
const masterRoutes = require("../routes/master.routes");
const categoryRoutes = require("../routes/category.routes");
const certificateRoutes = require("../routes/certificate.routes");
const sociallinksRoutes = require("../routes/sociallinks.routes");
const freelancerBannerProjectRoutes = require("../routes/freelancerBannerProject.routes");
const freelancer_resumeRoutes = require("../routes/freelancer_resume.routes");
module.exports = function initializeRoutes(app) {
  authRoutes(app);
  userRoutes(app);
  registrationRoutes(app);
  productRoutes(app);
  masterRoutes(app);
  categoryRoutes(app);
  certificateRoutes(app);
  sociallinksRoutes(app);
  freelancerBannerProjectRoutes(app);
  freelancer_resumeRoutes(app);
};
