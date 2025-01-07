const express = require('express')
const routes = express.Router()
const reportController = require('../controllers/reportController');
const { verifyAccessToken } = require('../helpers/jwtHelpers');


//add report
routes.post('/addreport/:studentId', verifyAccessToken, reportController.addReport)

// Student fetches their own report
routes.get("/reports/student", verifyAccessToken, reportController.fetchStudentReport);

// Lecturer fetches reports they’ve given
routes.get("/reports/lecturer", verifyAccessToken, reportController.fetchLecturerReports);

// Admin fetches all reports
routes.get("/reports/admin", verifyAccessToken, reportController.fetchAllReports);

module.exports = routes