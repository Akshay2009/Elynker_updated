const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;
const Registration = db.registration;
const serviceResponse = require('../config/serviceResponse')


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
    // password: bcrypt.hashSync(req.body.password, 8)
  });
  if (user) {
    const registration = await Registration.create({
      name: req.body.name,
      city: req.body.city,
      isActive: true,
      registration_type: req.body.registration_type || 1,
      userId: user.id,
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
        const roleNames = roleOfUser.map(role => role.dataValues.name);
        let token;
            if(roleNames.includes('user')){
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
  })
      .then(async (user) => {
        if (!user) {
          return res.status(serviceResponse.badRequest).send({ message: serviceResponse.errorNotFound });
        }

        const result = await Registration.findOne({
          where: {
            userId: user.id,
          },
        });
        const roleOfUser = await user.getRoles();
        const roleNames = roleOfUser.map(role => role.dataValues.name);
        let token;
            if(roleNames.includes('user')){
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
          return res.status(serviceResponse.ok).send({
            user: user,
            roles: authorities,
            accessToken: token,
            registration: result,
          });
        });
      })
      .catch((err) => {
        return res.status(serviceResponse.internalServerError).send({ message: serviceResponse.internalServerErrorMessage });
      });
};
