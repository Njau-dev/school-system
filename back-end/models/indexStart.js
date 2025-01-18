const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes, Op } = require('sequelize');
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
db.Op = Op;


// Load models
db.users = require('./userModels')(sequelize, DataTypes);
db.assignments = require('./assignmentsModel')(sequelize, DataTypes);
db.submissions = require('./submissionsModel')(sequelize, DataTypes);
db.reports = require('./reportsModel')(sequelize, DataTypes);

// Define relationships

// Users and Assignments (Lecturer relationship)
db.users.hasMany(db.assignments, { foreignKey: 'lecturer_id', as: 'assignments' });
db.assignments.belongsTo(db.users, { foreignKey: 'lecturer_id', as: 'lecturer' });

// Assignments and Submissions
db.assignments.hasMany(db.submissions, { foreignKey: 'assignment_id', as: 'submissions' });
db.submissions.belongsTo(db.assignments, { foreignKey: 'assignment_id', as: 'assignment' });

// Users and Submissions
db.users.hasMany(db.submissions, { foreignKey: 'student_id', as: 'submissions' });
db.submissions.belongsTo(db.users, { foreignKey: 'student_id', as: 'student' });

// Reports and Users (Student relationship)
db.users.hasMany(db.reports, { foreignKey: "student_id", as: "studentReports" });
db.reports.belongsTo(db.users, { foreignKey: "student_id", as: "student" });

// Reports and Users (Lecturer relationship)
db.users.hasMany(db.reports, { foreignKey: "lecturer_id", as: "lecturerReports" });
db.reports.belongsTo(db.users, { foreignKey: "lecturer_id", as: "lecturer" });

// Synchronize the database
db.sequelize.sync({ force: false }) // No dropping existing tables
    .then(() => {
        console.log("Database sync completed.");
    })
    .catch((err) => {
        console.error("Error during database sync: ", err);
    });

module.exports = db;
