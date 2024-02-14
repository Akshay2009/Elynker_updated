const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
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
      idle: config.pool.idle
    } 
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.registration = require('../models/registration.model.js')(sequelize, Sequelize);
db.product = require('../models/product.model.js')(sequelize, Sequelize);
db.cityMaster = require('../models/cityMaster.js')(sequelize, Sequelize);
db.stateMaster = require('../models/stateMaster.js')(sequelize, Sequelize);
db.currencyMaster = require('../models/currencyMaster.js')(sequelize, Sequelize);
db.registrationTypesMaster= require('../models/registrationTypesMaster.js')(sequelize, Sequelize);
db.businessDetail= require('../models/business_detail.model.js')(sequelize, Sequelize);
db.category = require('../models/category.model.js')(sequelize,Sequelize);
db.certificate=require('../models/certificate.js')(sequelize,Sequelize);
db.sociallinks=require('../models/sociallinks.model.js')(sequelize,Sequelize);
db.freelancerBannerProject = require('../models/freelancerBannerProject.js')(sequelize,Sequelize);
db.unitMaster = require('../models/unitMaster.model.js')(sequelize,Sequelize);
db.freelancer_resume=require('../models/freelancer_resume.model.js')(sequelize,Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  onDelete: 'CASCADE'
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  onDelete: 'CASCADE'
});

db.ROLES = ["user", "admin", "moderator"];
//associate user and registration as 1:1
db.user.hasOne(db.registration,{ onDelete: 'CASCADE'});
db.registration.belongsTo(db.user);

//associate registration and document as 1:1
db.registration.hasMany(db.businessDetail,{ onDelete: 'CASCADE'});
db.businessDetail.belongsTo(db.registration);

//associate registration and product as 1:1 with foreign key on product model
db.registration.hasMany(db.product,{ onDelete: 'CASCADE'});
db.product.belongsTo(db.registration);

//associate certificate with registration as 1:1 foreign key on certificate
db.registration.hasMany(db.certificate,{ onDelete: 'CASCADE'});
db.certificate.belongsTo(db.registration);

//associate sociallinks associated with registration as 1:1 foreign key on sociallink
db.registration.hasMany(db.sociallinks,{ onDelete: 'CASCADE'});
db.sociallinks.belongsTo(db.registration);

//associate sociallinks associated with registration as 1:1 foreign key on Resume
db.registration.hasMany(db.freelancer_resume,{ onDelete: 'CASCADE'});
db.freelancer_resume.belongsTo(db.registration);

//associate Product and Category as m:m
db.product.belongsToMany(db.category, {
  through: "product_category",
  onDelete: 'CASCADE',
});
db.category.belongsToMany(db.product, {
  through: "product_category",
  onDelete: 'CASCADE',
});

// Set up self-referencing foreign key
db.category.hasMany(db.category, { foreignKey: 'parent_id', onDelete: 'CASCADE', as: 'children' });


//associate Registration and UsersBanners as 1 to m
db.registration.hasMany(db.freelancerBannerProject, { onDelete: 'CASCADE' });
db.freelancerBannerProject.belongsTo(db.registration);

module.exports = db;