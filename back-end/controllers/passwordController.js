const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require("../models/indexStart");
const createError = require("http-errors");
const bycrypt = require('bcrypt');

const User = db.users;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

module.exports = {
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw createError.NotFound("User not registered");
            }

            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                ${process.env.FRONTEND_BASE_URL}/reset-password/${token}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            // console.log(transporter.sendMail(mailOptions));
            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: 'Password reset email sent' });
        } catch (error) {
            next(error);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, password } = req.body;
            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [db.Op.gt]: Date.now() },
                },
            });
            if (!user) {
                throw createError.BadRequest("Password reset token is invalid or has expired");
            }

            // hash password
            const salt = await bycrypt.genSalt(12);
            const hashedPwd = await bycrypt.hash(password, salt);

            user.password = hashedPwd;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            res.status(200).send({ message: 'Password has been reset' });
        } catch (error) {
            next(error);
        }
    },
};