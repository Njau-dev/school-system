const express = require('express')
const routes = express.Router()
const assignmentController = require('../controllers/assignmentController')
const { verifyAccessToken } = require('../helpers/jwtHelpers')
const auth = require('../helpers/jwtHelpers')

routes.post('/addassignment', verifyAccessToken, auth.restrict('student', 'admin'), assignmentController.addAssignment)

//fetch all assignments
routes.get("/assignments", verifyAccessToken, assignmentController.fetchAllAssignments);

//fetch assignment by lecturer
routes.get('/assignments/lecturer/:lecturerId', verifyAccessToken, assignmentController.fetchAssignmentsByLecturer)

//fetch specific assignment
routes.get('/assignment/:assignmentId', verifyAccessToken, assignmentController.fetchSpecificAssignment)

//fetch summarry for a specific assignment
routes.get('/assignments/:assignmentId/summary', assignmentController.fetchAssignmentSummary)

routes.put("/assignments/:assignmentId", verifyAccessToken, auth.restrict('student', 'admin'), auth.validateLecturerAccess, assignmentController.updateAssignment);

routes.delete("/assignments/:assignmentId", verifyAccessToken, auth.restrict('student', 'admin'), auth.validateLecturerAccess, assignmentController.deleteAssignment);

module.exports = routes