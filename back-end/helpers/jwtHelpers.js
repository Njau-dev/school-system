const JWT = require("jsonwebtoken");
const createError = require("http-errors");


module.exports = {
    signAccessToken: (UserId, userRole) => {
        return new Promise((resolve, reject) => {
            const payload = { UserId, role: userRole }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '65m',
                issuer: 'Njau',
                audience: UserId.toString(),
            }
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) reject(error);
                resolve(token)
            })
        })
    },

    // middlware to verify accesstoken
    verifyAccessToken: (req, res, next) => {
        if (!req.headers["authorization"]) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return next(createError.Unauthorized())
            }
            req.payload = payload;
            next()
        })
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
            const userRole = req.payload.role
            console.log(userRole);

            if (!userRole || allowedRoles.includes(userRole)) {
                return next(
                    createError.Forbidden('Sorry! You do not have permission to perform this action')
                )
            }
            next()
        }
    }
}