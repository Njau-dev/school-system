const express = require('express')
const routes = express.Router()
const submissionController = require('../controllers/submissionsController')
const { verifyAccessToken } = require('../helpers/jwtHelpers')
const upload = require('../helpers/multerConfig'); // Import Multer configuration

routes.post('/submit/:assignmentId', verifyAccessToken, upload.single('file'), submissionController.submitAssignment)


module.exports = routes