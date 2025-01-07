const express = require('express')
const routes = express.Router()
const submissionController = require('../controllers/submissionsController')
const { verifyAccessToken } = require('../helpers/jwtHelpers')
const upload = require('../helpers/multerConfig'); // Import Multer configuration
const auth = require('../helpers/jwtHelpers')

routes.post('/submit/:assignmentId', verifyAccessToken, upload.single('file'), submissionController.submitAssignment)

//fetch all submissions
routes.get('/submissions', verifyAccessToken, submissionController.fetchStudentSubmissions)

//fetch student submission by id along with assignment details
routes.get('/submission/student/:id', verifyAccessToken, submissionController.fetchStudentSubmissionById)

//fetch lecturer submission along with a student details
routes.get('/submission/lecturer/:id', verifyAccessToken, auth.restrict('student'), submissionController.fetchLecturerSubmissionById)

routes.get('/assignments/:assignmentId/submissions', submissionController.fetchSubmissionsByAssignmentId);

//submissions summarry for lec and admin
routes.get('/submissions/summary', verifyAccessToken, submissionController.fetchSubmissionsSummary)

// Grade submission
routes.put('/submissions/:id', verifyAccessToken, auth.validateLecturerAccess, submissionController.gradeSubmission);


module.exports = routes