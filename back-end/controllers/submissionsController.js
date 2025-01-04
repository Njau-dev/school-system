const db = require("../models/indexStart");
const createError = require("http-errors");
const { initializeB2, uploadToB2 } = require('../helpers/cloudStorage')

// Models
const Assignment = db.assignments;
const User = db.users;
const Submission = db.submissions;

const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
];

module.exports = {
    submitAssignment: async (req, res, next) => {
        try {
            const { comment } = req.body;
            const student_id = req.user.id;
            const file = req.file; // Assuming multer is used for file handling

            const assignment_id = req.params.assignmentId;

            // Validate the assignment exists
            const assignment = await Assignment.findByPk(assignment_id);
            if (!assignment) {
                throw createError.NotFound('Assignment not found');
            }

            // Ensure the student hasn't already submitted
            const existingSubmission = await Submission.findOne({
                where: { assignment_id, student_id },
            });
            if (existingSubmission) {
                return res.status(400).json({
                    message: 'You have already submitted this assignment',
                });
            }

            console.log('file', file);


            // Validate file type
            if (!file || !allowedFileTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message:
                        'Invalid file type. Only PDF, Word, TXT, or MD files are allowed.',
                });
            }

            // Initialize Backblaze
            const b2 = await initializeB2();

            // Upload file to Backblaze
            const fileName = `assignment_${Date.now()}_${file.originalname}`;
            const fileUrl = await uploadToB2(b2, process.env.B2_BUCKET_NAME, file.buffer, fileName);

            // Save submission to the database
            const submission = await Submission.create({
                assignment_id,
                student_id,
                file_url: fileUrl,
                comment: comment || null,
            });

            res.status(201).json({
                message: 'Assignment submitted successfully',
                submission,
            });
        } catch (error) {
            next(error);
        }
    },
};