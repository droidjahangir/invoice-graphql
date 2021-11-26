const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const Customer = require('../../models/Customer');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    async login(_, { email, password, role }) {
      const { errors, valid } = validateLoginInput(email, password, role);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (role == 'user') {
        const user = await User.findOne({ email });

        if (!user) {
          errors.general = 'User not found';
          throw new UserInputError('User not found', { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = 'Wrong crendetials';
          throw new UserInputError('Wrong crendetials', { errors });
        }

        const token = generateToken(user);

        return {
          ...user._doc,
          id: user._id,
          token,
        };
      }
      if (role == 'customer') {
        const customer = await Customer.findOne({ email });

        if (!customer) {
          errors.general = 'Customer not found';
          throw new UserInputError('Customer not found', { errors });
        }

        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
          errors.general = 'Wrong crendetials';
          throw new UserInputError('Wrong crendetials', { errors });
        }

        const token = generateToken(customer);

        return {
          ...customer._doc,
          id: customer._id,
          token,
        };
      }
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword, role } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        role
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (role == 'user') {
        // TODO: Make sure user doesnt already exist
        const user = await User.findOne({ email });
        if (user) {
          throw new UserInputError('Email is taken', {
            errors: {
              email: 'This Email is taken',
            },
          });
        }
        // hash password and create an auth token
        password = await bcrypt.hash(password, 12);

        const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
          role,
        });

        const res = await newUser.save();

        const token = generateToken(res);

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      }
      if (role == 'customer') {
        // TODO: Make sure customer doesnt already exist
        const customer = await Customer.findOne({ email });
        if (customer) {
          throw new UserInputError('Email is taken', {
            errors: {
              email: 'This Email is taken',
            },
          });
        }
        // hash password and create an auth token
        password = await bcrypt.hash(password, 12);

        const newCustomer = new Customer({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
          role,
        });

        const res = await newCustomer.save();

        const token = generateToken(res);

        return {
          ...res._doc,
          id: res._id,
          token,
        };
      }
    },
  },
};
