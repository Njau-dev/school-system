const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models/indexStart");

const Assignment = db.assignments

module.exports = {
    signAccessToken: (UserId, userRole) => {
        return new Promise((resolve, reject) => {
            const payload = { UserId, role: userRole }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '90m',
                issuer: 'Njau',
                audience: UserId.toString(),
            }
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) reject(error);
                resolve(token)
            })
        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers["authorization"]) {
            return next(createError.Unauthorized("Authorization header is missing."));
        }

        const authHeader = req.headers["authorization"];
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized("Invalid token."));
            }

            // Attach payload directly to req.user
            req.user = {
                id: payload.UserId,
                role: payload.role,
            };

            next();
        });
    },


    signRefreshToken: (UserId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'NjauTechnologies.com',
                audience: String(UserId),
            }
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) {
                    console.log(error.message)
                    reject(createError.InternalServerError());
                }
                resolve(token);
            })
        })
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud

                resolve(userId)
            })
        })
    },

    restrict: (...allowedRoles) => {
        return (req, res, next) => {
            const userRole = req.user.role

            if (!userRole || allowedRoles.includes(userRole)) {
                return next(
                    createError.Forbidden('Sorry! You do not have permission to perform this action')
                )
            }
            next()
        }
    },

    validateLecturerAccess: async (req, res, next) => {
        try {
            const lecturerId = req.user.id;
            const assignmentId = req.params.assignmentId;


            const assignment = await Assignment.findOne({
                where: { assignment_id: assignmentId, lecturer_id: lecturerId },
            });


            if (!assignment) {
                return res.status(403).send({
                    message: "You are not authorized to access or modify this assignment.",
                });
            }

            next(); // Proceed if validation passes
        } catch (error) {
            next(error);
        }
    },

}