const db = require("../models/indexStart");
const createError = require("http-errors");
const { initializeB2, uploadToB2, authorizeAccount, getDownloadAuthorization, downloadFile } = require('../helpers/cloudStorage')
const path = require('path')


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
            const student_id = req.user.id;
            const file = req.file;

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
                file_url: fileName,
            });

            res.status(201).json({
                message: 'Assignment submitted successfully',
                submission,
            });
        } catch (error) {
            next(error);
        }
    },


    fetchStudentSubmissions: async (req, res, next) => {
        try {
            const student_id = req.user.id;

            // Fetch submissions for the logged-in student, including assignment titles
            const submissions = await Submission.findAll({
                where: { student_id },
                include: [
                    {
                        model: Assignment,
                        as: 'assignment',
                        attributes: ["title"],
                    },
                ],
                attributes: ["id", "graded", "grade", "submitted_at"],
                order: [["submitted_at", "DESC"]], // Order submissions by latest first
            });

            if (!submissions) {
                return createError.NotFound({ message: "Submissions not found." });
            }

            res.status(200).json({
                message: "Submissions fetched successfully",
                submissions,
            });
        } catch (error) {
            next(error);
        }
    },

    fetchLecturerSubmissions: async (req, res, next) => {
        try {
            const lecturer_id = req.user.id;

            // Fetch submissions for assignments created by the logged-in lecturer
            const submissions = await Submission.findAll({
                include: [
                    {
                        model: Assignment,
                        as: 'assignment',
                        attributes: ["title", "assignment_id"],
                        where: { lecturer_id: lecturer_id }, // Ensure the assignment was created by the lecturer
                    },
                    {
                        model: User,
                        as: 'student',
                        attributes: ["name"], // Include student name
                    },
                ],
                attributes: ["id", "submitted_at", "graded", "grade"],
                order: [["submitted_at", "DESC"]], // Order by latest submissions first
            });

            if (!submissions.length) {
                return res.status(404).json({
                    message: "No submissions found for your assignments.",
                });
            }

            const formattedSubmissions = submissions.map((submission) => ({
                id: submission.id,
                studentName: submission.student.name,
                submittedAt: submission.submitted_at,
                graded: submission.graded,
                grade: submission.grade,
            }));

            res.status(200).json({
                message: "Submissions fetched successfully.",
                submissions: formattedSubmissions,
            });
        } catch (error) {
            next(error);
        }
    },


    fetchAdminSubmissions: async (req, res, next) => {
        try {
            // Fetch all submissions across all assignments created by all lecturers
            const submissions = await Submission.findAll({
                include: [
                    {
                        model: Assignment,
                        as: 'assignment',
                        attributes: ["title", "assignment_id"],
                    },
                    {
                        model: User,
                        as: 'student',
                        attributes: ["name"], // Include student name
                    },
                ],
                attributes: ["id", "submitted_at", "graded", "grade"],
                order: [["submitted_at", "DESC"]], // Order by latest submissions first
            });

            if (!submissions.length) {
                return res.status(404).json({
                    message: "No submissions found.",
                });
            }

            const formattedSubmissions = submissions.map((submission) => ({
                id: submission.id,
                studentName: submission.student.name,
                submittedAt: submission.submitted_at,
                graded: submission.graded,
                grade: submission.grade,
            }));

            res.status(200).json({
                message: "Submissions fetched successfully.",
                submissions: formattedSubmissions,
            });
        } catch (error) {
            next(error);
        }
    },

    // Function to fetch submission by ID for students
    fetchStudentSubmissionById: async (req, res) => {
        const { id } = req.params;

        try {
            // Fetch submission details from the database
            const record = await Submission.findOne({
                where: { id: id },
                include: [
                    {
                        model: User,
                        as: 'student',
                        attributes: ['name', 'email'],
                    }
                ]
            });

            if (!record) {
                return createError.NotFound({ message: "Submission not found." });
            }

            // Authorize Backblaze B2 account
            const { authorizationToken, apiUrl, downloadUrl } = await authorizeAccount(
                process.env.B2_KEY_ID,
                process.env.B2_APPLICATION_KEY
            );

            // Get the download authorization token
            const downloadAuthToken = await getDownloadAuthorization(
                authorizationToken,
                apiUrl,
                process.env.B2_BUCKET_ID,
            );

            if (!downloadAuthToken) {
                throw createError.Unauthorized("Failed to get download authorization.");
            }

            // Constructing the full download URL in the controller
            const fullFileUrl = `${downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${record.file_url}?Authorization=${downloadAuthToken}`;

            // Define the local path to save the file temporarily
            const localPath = path.join(__dirname, `../downloads/${record.file_url}`);

            // Download the file
            await downloadFile(fullFileUrl, downloadAuthToken, localPath);


            // Send the submission details and file download link
            res.status(200).json({
                submission: record,
                downloadLink: `/downloads/${record.file_url}`,
            });

        } catch (error) {
            console.error("Error fetching submission:", error.message);
            res.status(500).json({ message: "Error fetching submission." });
        }
    },

    // Function to fetch submission by ID for lecturers
    fetchLecturerSubmissionById: async (req, res) => {
        const { id } = req.params;

        try {
            const record = await Submission.findOne({
                where: { id: id },
                include: [
                    {
                        model: User,
                        as: 'student',
                        attributes: ['name', 'email'],
                    }
                ]
            });

            if (!record) {
                return res.status(404).json({ message: "Submission not found." });
            }

            // Authorize Backblaze B2 account
            const { authorizationToken, apiUrl, downloadUrl } = await authorizeAccount(
                process.env.B2_KEY_ID,
                process.env.B2_APPLICATION_KEY
            );

            // Get the download authorization token
            const downloadAuthToken = await getDownloadAuthorization(
                authorizationToken,
                apiUrl,
                process.env.B2_BUCKET_ID,
                record.file_url
            );

            if (!downloadAuthToken) {
                throw createError.Unauthorized("Failed to get download authorization.");
            }

            // Constructing the full download URL in the controller
            const fullFileUrl = `${downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${record.file_url}?Authorization=${downloadAuthToken}`;

            // Define the local path to save the file temporarily
            const localPath = path.join(__dirname, `../downloads/${record.file_url}`);

            // Download the file
            await downloadFile(fullFileUrl, downloadAuthToken, localPath);
            // Send the submission details and file download link
            res.status(200).json({
                submission: record,
                downloadLink: `/downloads/${record.file_url}`,
            });

        } catch (error) {
            console.error("Error fetching submission:", error.message);
            res.status(500).json({ message: "Error fetching submission." });
        }
    },

    fetchSubmissionsByAssignmentId: async (req, res) => {
        const { assignmentId } = req.params;

        try {
            // Fetch all submissions for the given assignment
            const submissions = await Submission.findAll({
                where: { assignment_id: assignmentId },
                include: [
                    {
                        model: User,
                        as: 'student',
                        attributes: ['user_id', 'name', 'email'],
                    },
                ],
                attributes: ['id', 'submitted_at', 'grade', 'graded'],
            });

            if (!submissions || submissions.length === 0) {
                return res.status(404).json({ message: "No submissions found for this assignment." });
            }

            res.status(200).json({ submissions });
        } catch (error) {
            console.error("Error fetching submissions:", error.message);
            res.status(500).json({ message: "Error fetching submissions." });
        }
    },

    gradeSubmission: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { grade, comment } = req.body;

            console.log(id);
            console.log(grade)
            console.log(comment);


            // Validate the submission exists
            const submission = await Submission.findByPk(id);
            if (!submission) {
                return createError.NotFound({ message: 'Submission not found' });
            }

            // Update the grade and mark as graded
            submission.grade = grade;
            submission.graded = true;
            submission.comment = comment;
            await submission.save();

            res.status(200).json({
                message: 'Submission graded successfully',
                submission,
            });
        } catch (error) {
            next(error);
        }
    },

};