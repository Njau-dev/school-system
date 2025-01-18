const express = require('express')
const routes = express.Router()
const dashboardController = require('../controllers/dashboardController')
const { verifyAccessToken, restrict } = require('../helpers/jwtHelpers')

routes.get('/student/dashboard', verifyAccessToken, restrict('lecturer', 'admin'), dashboardController.studentDashboard)

routes.get('/lecturer/dashboard', verifyAccessToken, restrict('student', 'admin'), dashboardController.lecturerDashboard)

routes.get('/admin/dashboard', verifyAccessToken, restrict('lecturer', 'student'), dashboardController.adminDashboard)

routes.get('/student/charts', verifyAccessToken, dashboardController.getChartData)

routes.get('/lecturer/charts', verifyAccessToken, dashboardController.lecturerDashboardCharts)

routes.get('/admin/charts', verifyAccessToken, dashboardController.adminDashboardCharts)

routes.get('/student/tables', verifyAccessToken, dashboardController.fetchStudentAssignmentSummary)

routes.get('/lecturer/tables', verifyAccessToken, dashboardController.fetchStudentSummary)

routes.get('/admin/tables', verifyAccessToken, dashboardController.fetchStudentSummary)

module.exports = routes;