const express = require('express')
const routes = express.Router()
const submissionController = require('../controllers/submissionsController')
const { verifyAccessToken } = require('../helpers/jwtHelpers')
const upload = require('../helpers/multerConfig');
const auth = require('../helpers/jwtHelpers')

routes.post('/submit/:assignmentId', verifyAccessToken, upload.single('file'), submissionController.submitAssignment)

//fetch all student submissions
routes.get('/student/submissions', verifyAccessToken, submissionController.fetchStudentSubmissions)

//fetch all lecturer submissions
routes.get('/lecturer/submissions', verifyAccessToken, submissionController.fetchLecturerSubmissions)

//fetch all admin submissions
routes.get('/admin/submissions', verifyAccessToken, submissionController.fetchAdminSubmissions)

//fetch student submission by id along with assignment details
routes.get('/submission/student/:id', verifyAccessToken, submissionController.fetchStudentSubmissionById)

//fetch lecturer submission along with a student details
routes.get('/submission/lecturer/:id', verifyAccessToken, auth.restrict('student'), submissionController.fetchLecturerSubmissionById)

//fetch submissions by assignment
routes.get('/submissions/assignments/:assignmentId', submissionController.fetchSubmissionsByAssignmentId);

// Grade submission
routes.put('/submissions/:id', verifyAccessToken, auth.validateLecturerAccess, submissionController.gradeSubmission);


module.exports = routes