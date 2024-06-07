const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;
const Registration = db.registration;
const serviceResponse = require('../config/serviceResponse');
const Category = db.category;
const RolePermission = db.rolePermission;
const SystemModule = db.systemModules;


const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const sequelize = db.sequelize;
const logErrorToFile = require('../logger');
const { where } = require('sequelize');
const Sequelize = db.Sequelize;
const regTypes = ['B2C','Business','Freelancer'];



/**
 * Controller function to signup and save user details.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.signup = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      country_code: req.body.country_code,
      mobile_number: req.body.mobile_number,
      city: req.body.city,
      created_by: req.body.created_by,
      updated_by: req.body.updated_by,
    }, { transaction });

    const registration = await Registration.create({
      name: req.body.name,
      city: req.body.city,
      registration_type: req.body.registration_type,
      userId: user.id,
      created_by: req.body.created_by,
      updated_by: req.body.updated_by,
    }, { transaction });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      await user.setRoles(roles, { transaction });
    } else {
      if (req.body.registration_type) {
        let role = [];
        if (req.body.registration_type == 3) {
          role.push(regTypes[2]);
        }
        else if (req.body.registration_type == 2) {
          role.push(regTypes[1]);
        }
        else if (req.body.registration_type == 1) {
          role.push(regTypes[0]);
        }
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: role,
            },
          },
        });
        await user.setRoles(roles, { transaction });
      }
      else{
        let role = [];
        role.push(regTypes[0]);
        const roles = await Role.findAll({
          where: {
            name: {
              [Op.or]: role,
            },
          },
        });
        await user.setRoles(roles, { transaction });
      }
    }
    let expiresIn = 259200; // Default 3 days for non-'B2C' roles
    const roleOfUser = await user.getRoles({ transaction });
    const roleNames = roleOfUser.map((role) => role.dataValues.name);
    if (roleNames.includes(regTypes[0])) {
      expiresIn = 86400; // 24 hours for 'B2C' role
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn,
    });

    const authorities = roleNames.map((role) => `ROLE_${role.toUpperCase()}`);

    await transaction.commit();

    return res.status(serviceResponse.saveSuccess).send({
      user,
      roles: authorities,
      accessToken: token,
      registration,
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    logErrorToFile.logErrorToFile(err, 'auth.controller', 'signup');
    if (err instanceof Sequelize.Error) {
      return res.status(serviceResponse.badRequest).json({ error: err.message });
    }
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage });
  }
};


/**
 * Controller function for get business details and sign-in.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.signin = async (req, res) => {
  User.findOne({
    where: {
      mobile_number: req.body.mobile_number,
    },
    include: [
      {
        model: Role,
        attributes: ['id','name'], 
        through: { attributes: [], },
        include: [
          {
            model: RolePermission,
            attributes: { exclude: ['created_by', 'updated_by', 'createdAt', 'updatedAt'] },
            include: [
              {
                model: SystemModule,
                attributes: ['id','module_name'],
              },
            ],
            through: { attributes: [], },
          },
        ],
      },
    ],
  })
      .then(async (user) => {
        if (!user) {
          return res.status(serviceResponse.notFound).send({ message: serviceResponse.errorNotFound });
        }

        const result = await Registration.findOne({
          where: {
            userId: user.id,
          },
          include: [
            {
              model: Category,
              attributes: ['id', 'title', 'image_path', 'rank', 'category_type'], 
              through: { attributes: [], },
            },
          ],
        });
        if(result){
          result.last_login = Date.now();
          await result.save();
        }


        const roleNames = user.roles.map((role) => role.dataValues.name);
        let token;
            if(roleNames.includes('user')) {
              token = jwt.sign({ id: user.id },
                config.secret,
                {
                  algorithm: 'HS256',
                  allowInsecureKeySizes: true,
                  expiresIn: 86400, // 24 hours 
                });
            }else{
              token = jwt.sign({ id: user.id },
                config.secret,
                {
                  algorithm: 'HS256',
                  allowInsecureKeySizes: true,
                  expiresIn: 259200, // 3 days
                });
            }

      const roleNameAndPermission = user.roles.map((role) => role.dataValues);

        const modifiedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          city: user.city,
          country_code: user.country_code,
          mobile_number: user.mobile_number,
          username: user.username,
          is_active: user.is_active,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          created_by: user.created_by,
          updated_by: user.updated_by,
          //permissions: rolePermission.join(','),
        };
        return res.status(serviceResponse.ok).send({
          user: modifiedUser,
          roles: roleNameAndPermission,
          accessToken: token,
          registration: result,
        });

    })
    .catch((err) => {
      return res.status(serviceResponse.internalServerError).send({ message: serviceResponse.internalServerErrorMessage });
    });
};


module.exports.checkRolesOfUserUsingMobileNumber = async function(req,res){
  try{
    const mobile_number = req.body.mobile_number;
    const record = await User.findOne({
      where: {
        mobile_number: mobile_number,
      },
      attributes: ['id','mobile_number'],
      include:[
        {
          model: Role,
          attributes: ['id','name'],
          through: { attributes: [], },
        }
      ]
    });
    if(!record){
      return res.status(serviceResponse.notFound).json({ error: serviceResponse.errorNotFound });
    }
    const roles = record.roles.map(role => role.name);
    const restrictedRoles = ["Business", "Freelancer", "B2C"]; // front end user will have either B2C, Business or Freelancer Role

    let adminAccess = true;
    if (roles.length === 1 && restrictedRoles.includes(roles[0])) { // check for front end user
      adminAccess = false;
    }
    
    return res.status(serviceResponse.ok).json({ admin_access: adminAccess  });

  }catch(err){
    return res.status(serviceResponse.internalServerError).json({ error: serviceResponse.internalServerErrorMessage+" "+err.message })
  }
}