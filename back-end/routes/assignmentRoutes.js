const express = require('express')
const routes = express.Router()
const assignmentController = require('../controllers/assignmentController')
const { verifyAccessToken } = require('../helpers/jwtHelpers')
const auth = require('../helpers/jwtHelpers')

routes.post('/addassignment', verifyAccessToken, auth.restrict('student', 'admin'), assignmentController.addAssignment)

//fetch all student assignments
routes.get('/student/assignments', verifyAccessToken, assignmentController.fetchAssignmentsForStudent)

// fetch all lecturer assignments
routes.get('/lecturer/assignments', verifyAccessToken, assignmentController.fetchAssignmentsForLecturer)

//fetch assignment for admin
routes.get('/admin/assignments', verifyAccessToken, assignmentController.fetchAssignmentsForAdmin)

//fetch specific assignment
routes.get('/assignment/:assignmentId', verifyAccessToken, assignmentController.fetchSpecificAssignment)

//fetch assignment by lecturer
routes.get('/assignments/lecturer/:lecturerId', verifyAccessToken, assignmentController.fetchAssignmentsByLecturer)

//fetch summarry for a specific assignment
routes.get('/assignments/:assignmentId/summary', assignmentController.fetchAssignmentSummary)

//update assignment details
routes.put("/assignments/:assignmentId", verifyAccessToken, auth.restrict('student', 'admin'), auth.validateLecturerAccess, assignmentController.updateAssignment);

//delete assignment
routes.delete("/assignments/:assignmentId", verifyAccessToken, auth.restrict('student', 'admin'), auth.validateLecturerAccess, assignmentController.deleteAssignment);

module.exports = routes