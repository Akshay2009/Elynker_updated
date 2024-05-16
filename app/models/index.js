const config = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
    },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.role = require('../models/role.model.js')(sequelize, Sequelize);
db.registration = require('../models/registration.model.js')(sequelize, Sequelize);
db.product = require('../models/product.model.js')(sequelize, Sequelize);
db.cityMaster = require('../models/cityMaster.js')(sequelize, Sequelize);
db.stateMaster = require('../models/stateMaster.js')(sequelize, Sequelize);
db.currencyMaster = require('../models/currencyMaster.js')(sequelize, Sequelize);
db.registrationTypesMaster= require('../models/registrationTypesMaster.js')(sequelize, Sequelize);
db.businessDetail= require('../models/business_detail.model.js')(sequelize, Sequelize);
db.category = require('../models/category.model.js')(sequelize, Sequelize);
db.certificate=require('../models/certificate.js')(sequelize, Sequelize);
db.sociallinks=require('../models/sociallinks.model.js')(sequelize, Sequelize);
db.freelancerBannerProject = require('../models/freelancerBannerProject.js')(sequelize, Sequelize);
db.unitMaster = require('../models/unitMaster.model.js')(sequelize, Sequelize);
db.freelancerResume=require('../models/freelancer_resume.model.js')(sequelize, Sequelize);
db.socialMediaMaster=require('../models/socialMediaMaster.model.js')(sequelize, Sequelize);
db.adminModules=require('../models/adminModules.model.js')(sequelize, Sequelize);
db.languageMaster=require('../models/languageMaster.model.js')(sequelize, Sequelize);
db.educationMaster=require('../models/educationMaster.model.js')(sequelize, Sequelize);
db.enquiry = require('../models/enquiry.model.js')(sequelize, Sequelize);
db.moduleDetails = require('../models/moduleDetails.model.js')(sequelize, Sequelize);
db.membersContacted = require('../models/membersContacted.js')(sequelize, Sequelize);
db.cardSharing = require('./cardSharing.model.js')(sequelize,Sequelize);
db.widgets = require('../models/widgets.model.js')(sequelize,Sequelize);
db.requirement = require('../models/requirement.model.js')(sequelize,Sequelize);
db.addPage = require('../models/addPage.model.js')(sequelize,Sequelize);
db.vendorReviews = require('../models/vendorReviews.model.js')(sequelize,Sequelize);
db.systemModules = require('../models/systemModules.model.js')(sequelize,Sequelize);
db.rolePermission = require('../models/rolePermission.model.js')(sequelize,Sequelize);
db.adminTools = require('./adminTools.model.js')(sequelize,Sequelize);

db.role.belongsToMany(db.user, {
  through: 'user_roles',
  onDelete: 'CASCADE',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  onDelete: 'CASCADE',
});

db.ROLES = ['user', 'admin', 'moderator'];
// associate user and registration as 1:1
db.user.hasOne(db.registration, { onDelete: 'CASCADE' });
db.registration.belongsTo(db.user);

// associate registration and document as 1:m
db.registration.hasMany(db.businessDetail, { onDelete: 'CASCADE' });
db.businessDetail.belongsTo(db.registration);

// associate registration and product as 1:m with foreign key on product model
db.registration.hasMany(db.product, { onDelete: 'CASCADE' });
db.product.belongsTo(db.registration);

// associate certificate with registration as 1:m foreign key on certificate
db.registration.hasMany(db.certificate, { onDelete: 'CASCADE' });
db.certificate.belongsTo(db.registration);

// associate sociallinks associated with registration as 1:m foreign key on sociallink
db.registration.hasMany(db.sociallinks, { onDelete: 'CASCADE' });
db.sociallinks.belongsTo(db.registration);

// associate sociallinks associated with registration as 1:m foreign key on Resume
db.registration.hasMany(db.freelancerResume, { onDelete: 'CASCADE' });
db.freelancerResume.belongsTo(db.registration);

// associate Product and Category as m:m
db.product.belongsToMany(db.category, {
  through: 'product_category',
  onDelete: 'CASCADE',
});
db.category.belongsToMany(db.product, {
  through: 'product_category',
  onDelete: 'CASCADE',
});

// Set up self-referencing foreign key
db.category.hasMany(db.category, { foreignKey: 'parent_id', onDelete: 'CASCADE', as: 'children' });


// associate Registration and freelancerBannerProject as 1 to m
db.registration.hasMany(db.freelancerBannerProject, { onDelete: 'CASCADE' });
db.freelancerBannerProject.belongsTo(db.registration);

// associate Registration and Category as m:m
db.registration.belongsToMany(db.category, {
  through: 'user_category',
  onDelete: 'CASCADE',
});
db.category.belongsToMany(db.registration, {
  through: 'user_category',
  onDelete: 'CASCADE',
});

// associate Registration and enquiry as 1 to m
db.registration.hasMany(db.enquiry, { onDelete: 'CASCADE' });
db.enquiry.belongsTo(db.registration);

// associate registration and membersContacted as 1:m 
db.registration.hasMany(db.membersContacted, { onDelete: 'CASCADE' });
db.membersContacted.belongsTo(db.registration);

// associate certificate with registration as 1:m foreign key on certificate
db.registration.hasMany(db.vendorReviews, { onDelete: 'CASCADE' });
db.vendorReviews.belongsTo(db.registration);

// associate Registration and requirement as 1 to m
db.registration.hasMany(db.requirement, { onDelete: 'CASCADE' });
db.requirement.belongsTo(db.registration);


// associate Role and RolePermission as m:m
db.role.belongsToMany(db.rolePermission, {
  through: 'role_rolePermissions',
  onDelete: 'CASCADE',
});
db.rolePermission.belongsToMany(db.role, {
  through: 'role_rolePermissions',
  onDelete: 'CASCADE',
});

//associate systemModules and rolePermission as 1 to m
db.systemModules.hasMany(db.rolePermission, {
  onDelete: 'CASCADE',
});
db.rolePermission.belongsTo(db.systemModules, {
  onDelete: 'CASCADE',
});

module.exports = db;
