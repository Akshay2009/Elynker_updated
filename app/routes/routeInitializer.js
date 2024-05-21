// routeInitializer.js
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const registrationRoutes = require('../routes/registration.routes');
const productRoutes = require('../routes/product.routes');
const masterRoutes = require('../routes/master.routes');
const categoryRoutes = require('../routes/category.routes');
const certificateRoutes = require('../routes/certificate.routes');
const sociallinksRoutes = require('../routes/sociallinks.routes');
const freelancerBannerProjectRoutes = require('../routes/freelancerBannerProject.routes');
const freelancerResumeRoutes = require('../routes/freelancer_resume.routes');
const socialmediaMasterRoutes = require('../routes/socialmediaMaster.routes');
const adminModulesRoutes = require('../routes/adminModules.routes');
const rolesRoutes = require('../routes/role.routes');
const filterVendors = require('../routes/miscellaneous.routes')
const languageMaster = require('../routes/master.routes')
const educationMaster = require('../routes/master.routes')
const enquiryRoutes = require('../routes/enquiry.routes');
const moduleDetailsRoutes = require('../routes/moduleDetails.routes');
const membersContactedRoute = require('../routes/membersContacted.routes');
const widgets = require('../routes/widgets.routes');
const requirementRoutes = require('../routes/requirement.routes'); 
const addPagesRoutes = require('../routes/addPage.routes');
const vendorReviews = require('../routes/vendorReviews.routes');
const systemModules = require('../routes/systemModules.routes');
const rolePermissionRoutes = require('../routes/rolePermission.routes');
const adminToolsRoutes = require('./adminTools.routes');
const widgetDetailsRoutes = require('../routes/widgetDetails.route');
const personsContacted = require('./personContacted.routes');

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
  freelancerResumeRoutes(app);
  socialmediaMasterRoutes(app);
  adminModulesRoutes(app);
  rolesRoutes(app);
  filterVendors(app);
  languageMaster(app);
  educationMaster(app);
  enquiryRoutes(app);
  moduleDetailsRoutes(app);
  membersContactedRoute(app);
  widgets(app);
  requirementRoutes(app);
  addPagesRoutes(app);
  vendorReviews(app);
  systemModules(app);
  rolePermissionRoutes(app);
  adminToolsRoutes(app);
  widgetDetailsRoutes(app);
  personsContacted(app);
};
