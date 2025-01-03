const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
}
);

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Connection successful'))
    .catch((err) => console.error('Unable to connect:', err));

// Initialize the database object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.users = require('./userModels')(sequelize, DataTypes);
db.assignments = require('./assignmentsModel')(sequelize, DataTypes);
db.submissions = require('./submissionsModel')(sequelize, DataTypes);
db.reports = require('./reportsModel')(sequelize, DataTypes);

// Define relationships

// Users and Assignments
db.users.hasMany(db.assignments, { foreignKey: 'user_id' });
db.assignments.belongsTo(db.users, { foreignKey: 'user_id' });

// Assignments and Submissions
db.assignments.hasMany(db.submissions, { foreignKey: 'assignment_id' });
db.submissions.belongsTo(db.assignments, { foreignKey: 'assignment_id' });

// Users and Submissions
db.users.hasMany(db.submissions, { foreignKey: 'user_id' });
db.submissions.belongsTo(db.users, { foreignKey: 'user_id' });

// Users and Reports
db.users.hasMany(db.reports, { foreignKey: 'user_id' });
db.reports.belongsTo(db.users, { foreignKey: 'user_id' });

// Synchronize the database
db.sequelize.sync({ force: false }) // No dropping existing tables
    .then(() => {
        console.log("Database sync completed.");
    })
    .catch((err) => {
        console.error("Error during database sync: ", err);
    });

module.exports = db;
