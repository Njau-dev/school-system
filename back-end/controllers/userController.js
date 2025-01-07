const db = require("../models/indexStart");
const createError = require("http-errors");
const { authSchema } = require("../helpers/validationSchema");
const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelpers");
const Joi = require("joi");

// Use the User model
const User = db.users;

module.exports = {
    // Register a new user
    registerUser: async (req, res, next) => {
        try {
            const { email, name, password } = await authSchema.validateAsync(req.body);

            // Check if the email already exists
            const exists = await User.findOne({ where: { email } });
            if (exists) {
                throw createError.Conflict(`${email} is already registered`);
            }

            const newUser = await User.create({ name, email, password });

            const accessToken = await signAccessToken(newUser.user_id);
            const refreshToken = await signRefreshToken(newUser.user_id);

            // Respond with tokens
            res.status(201).send({ accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    },


    // Login a user
    loginUser: async (req, res, next) => {
        try {
            // Validate the request body (only email and password)
            const { email, password } = await Joi.object({
                email: Joi.string().email().required().lowercase(),
                password: Joi.string().min(6).required(),
            }).validateAsync(req.body);

            // Check if the user exists
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw createError.NotFound("User not registered");
            }

            // Verify password
            const isMatch = await user.isValidPassword(password);
            console.log(isMatch);

            if (!isMatch) {
                throw createError.Unauthorized("Invalid email or password");
            }

            // Generate access token
            const accessToken = await signAccessToken(user.user_id, user.role);

            // Send success response
            res.status(200).send({
                message: "Login successful",
                accessToken,
            });
        } catch (error) {
            // Handle Joi validation errors
            if (error.isJoi === true) {
                return next(createError.BadRequest("Invalid email or password"));
            }
            next(error);
        }
    },


    // Get all users (Admin only)
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.findAll({});
            res.status(200).send(users);
        } catch (error) {
            next(error);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            const { userId } = req.params;

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw createError.NotFound(`User with ID ${userId} not found.`);
            }

            res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    },

    // Update user role (Admin only)
    updateUserRole: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            // Validate the role
            if (!["admin", "lecturer"].includes(role)) {
                throw createError.BadRequest("Invalid role. Role must be 'admin' or 'lecturer' to update a user.");
            }

            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                throw createError.NotFound("User not found.");
            }

            user.role = role;
            await user.save();

            res.status(200).send({ message: `User role updated to '${role}'`, user });
        } catch (error) {
            next(error);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { userId } = req.params; z

            const user = await User.findByPk(userId);

            if (!user) {
                throw createError.NotFound(`User with ID ${userId} not found.`);
            }

            await user.destroy(); // Delete the user from the database

            res.status(200).send({ message: `User with ID ${userId} has been deleted.` });
        } catch (error) {
            next(error);
        }
    }

};
