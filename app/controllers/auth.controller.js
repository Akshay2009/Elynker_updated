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


/**
 * Controller function to signup and save user details.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.signup = async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    country_code: req.body.country_code,
    mobile_number: req.body.mobile_number,
    city: req.body.city,
    created_by: req.body.created_by,
    updated_by: req.body.updated_by,
    // password: bcrypt.hashSync(req.body.password, 8)
  });
  if (user) {
    const registration = await Registration.create({
      name: req.body.name,
      city: req.body.city,
      registration_type: req.body.registration_type || 1,
      userId: user.id,
      created_by: req.body.created_by,
      updated_by: req.body.updated_by,
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      await user.setRoles(roles);
    } else {
      await user.setRoles([1]);
    }

    const roleOfUser = await user.getRoles();
        const roleNames = roleOfUser.map((role) => role.dataValues.name);
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

    const authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push('ROLE_' + roles[i].name.toUpperCase());
      }
      return res.status(serviceResponse.saveSuccess).send({
        user: user,
        roles: authorities,
        accessToken: token,
        registration: registration,
      });
    });
  } else {
    return res.status(serviceResponse.badRequest).send({ message: serviceResponse.errorCreatingRecord });
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
