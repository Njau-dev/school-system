require('dotenv').config();

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    dialect: 'mysql',
    port: process.env.PORT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}