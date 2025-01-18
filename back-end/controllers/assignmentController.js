const db = require("../models/indexStart");
const createError = require("http-errors");
const Sequelize = require('sequelize');


// Models
const Assignment = db.assignments;
const User = db.users;
const Submission = db.submissions;

module.exports = {
    // Add Assignment
    addAssignment: async (req, res, next) => {
        try {
            if (!req.user) {
                throw createError.Unauthorized("User information is missing.");
            }


            const { title, description } = req.body;
            const createdBy = req.user.id;

            // Ensure only lecturers can create assignments
            if (req.user.role !== "lecturer") {
                throw createError.Forbidden("Only lecturers can create assignments.");
            }

            // Create the assignment
            const newAssignment = await Assignment.create({
                title,
                description,
                lecturer_id: createdBy,
            });

            res.status(201).send({
                message: "Assignment created successfully.",
                assignment: newAssignment.title,
            });
        } catch (error) {
            next(error);
        }
    },


    // Fetch all assignments for Students
    fetchAssignmentsForStudent: async (req, res, next) => {
        try {
            const userId = req.user.id; // Assume student ID is retrieved from the authenticated user

            // Fetch assignments with lecturer details
            const assignments = await Assignment.findAll({
                include: [
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name"],
                    },
                    {
                        model: Submission,
                        as: "submissions",
                        attributes: ["student_id"],
                    },
                ],
            });

            // Process assignments for the student
            const response = assignments.map((assignment) => {
                // Check if the student has submitted for this assignment
                const studentSubmission = assignment.submissions.find(
                    (submission) => submission.student_id === userId
                );

                return {
                    id: assignment.assignment_id,
                    title: assignment.title,
                    description: assignment.description,
                    createdAt: assignment.created_at,
                    lecturer: assignment.lecturer.name,
                    submissionStatus: studentSubmission ? "submitted" : "notSubmitted",
                };
            });

            res.status(200).send(response);
        } catch (error) {
            console.error("Error in fetchAssignmentsForStudent:", error.message);
            next(error);
        }
    },


    // Fetch assignments for lecturers
    fetchAssignmentsForLecturer: async (req, res, next) => {
        try {
            const userId = req.user.id;

            // Fetch assignments created by the lecturer
            const assignments = await Assignment.findAll({
                where: { lecturer_id: userId },
                include: [
                    {
                        model: Submission,
                        as: "submissions",
                        attributes: ["student_id"],
                    },
                ],
            });

            // Fetch the total number of students (assuming the students table exists)
            const totalStudentsCount = await User.count({ where: { role: "student" } });

            const response = assignments.map((assignment) => {
                const submittedCount = assignment.submissions.length;

                const hasSubmitted = submittedCount === totalStudentsCount;
                const submissionRate = `${submittedCount}/${totalStudentsCount}`;
                const submissionPercentage = ((submittedCount / totalStudentsCount) * 100).toFixed(2);

                return {
                    id: assignment.assignment_id,
                    title: assignment.title,
                    description: assignment.description,
                    createdAt: assignment.created_at,
                    hasSubmitted,
                    submissionRate,
                    submissionPercentage: `${submissionPercentage}%`,
                };
            });

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    },


    // Fetch assignments for admin
    fetchAssignmentsForAdmin: async (req, res, next) => {
        try {
            // Fetch all assignments with lecturer and submission details
            const assignments = await Assignment.findAll({
                include: [
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name"],
                    },
                    {
                        model: Submission,
                        as: "submissions",
                        attributes: ["student_id"],
                    },
                ],
            });

            // Fetch the total number of students (assuming the students table exists)
            const totalStudentsCount = await User.count({ where: { role: "student" } });

            const response = assignments.map((assignment) => {
                const submittedCount = assignment.submissions.length;

                const hasSubmitted = submittedCount === totalStudentsCount;
                const submissionRate = `${submittedCount}/${totalStudentsCount}`;
                const submissionPercentage = ((submittedCount / totalStudentsCount) * 100).toFixed(2);

                return {
                    id: assignment.assignment_id,
                    title: assignment.title,
                    description: assignment.description,
                    createdAt: assignment.created_at,
                    lecturer: assignment.lecturer.name,
                    hasSubmitted,
                    submissionRate,
                    submissionPercentage: `${submissionPercentage}%`,
                };
            });

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    },


    //for admin user management
    fetchAssignmentsByLecturer: async (req, res, next) => {
        try {
            const lecturerId = req.params.lecturerId;

            const assignments = await Assignment.findAll({
                where: { lecturer_id: lecturerId },
                include: [
                    {
                        model: User,
                        as: 'lecturer',
                        attributes: ['name', 'email'],
                    },
                    {
                        model: Submission,
                        as: "submissions",
                        attributes: ['grade', 'graded'],
                    },
                ],
            });

            const response = assignments.map((assignment) => {
                const gradedSubmissions = assignment.submissions.filter((submission) => submission.graded);

                // Calculate grading status and mean grade
                const gradingStatus = gradedSubmissions.length > 0 ? 'Graded' : 'Not Graded';
                const meanGrade =
                    gradedSubmissions.length > 0
                        ? (
                            gradedSubmissions.reduce((total, sub) => total + sub.grade, 0) /
                            gradedSubmissions.length
                        ).toFixed(2)
                        : null;

                return {
                    id: assignment.assignment_id,
                    title: assignment.title,
                    description: assignment.description,
                    createdAt: assignment.created_at,
                    gradingStatus,
                    meanGrade,
                    lecturer: assignment.lecturer,
                };
            });

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    },

    fetchSpecificAssignment: async (req, res, next) => {
        try {
            const assignmentId = req.params.assignmentId;

            // Fetch the assignment with lecturer and student submissions
            const assignment = await Assignment.findOne({
                where: { assignment_id: assignmentId },
                include: [
                    {
                        model: User,
                        as: 'lecturer',
                        attributes: ['name', 'email'],
                    },
                    {
                        model: Submission,
                        as: "submissions",
                        include: [
                            {
                                model: User,
                                as: 'student',
                                attributes: ['name', 'email'],
                            },
                        ],
                        attributes: ['grade', 'graded', 'student_id'],
                    },
                ],
            });

            if (!assignment) {
                throw createError.NotFound({ message: 'Assignment not found' });
            }

            // Map student submissions to build a detailed response
            const students = assignment.submissions.map((submission) => ({
                id: submission.student?.user_id,
                name: submission.student?.name,
                email: submission.student?.email,
                hasSubmitted: true,
                grade: submission.grade,
                graded: submission.graded,
            }));

            // Build response object
            const response = {
                id: assignment.assignment_id,
                title: assignment.title,
                description: assignment.description,
                createdAt: assignment.created_at,
                lecturer: assignment.lecturer,
                students,
            };

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    },

    // Update Assignment
    updateAssignment: async (req, res, next) => {
        try {
            const assignmentId = req.params.assignmentId;
            const lecturerId = req.user.id;

            // Find the assignment
            const assignment = await Assignment.findOne({
                where: { assignment_id: assignmentId, lecturer_id: lecturerId },
            });

            if (!assignment) {
                throw createError.Forbidden({
                    message: "You are not authorized to update this assignment or it does not exist.",
                });
            }

            // Update assignment fields
            const { title, description } = req.body;
            assignment.title = title || assignment.title;
            assignment.description = description || assignment.description;

            await assignment.save();

            res.status(200).send({
                message: "Assignment updated successfully.",
                assignment,
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete Assignment
    deleteAssignment: async (req, res, next) => {
        try {
            const assignmentId = req.params.assignmentId;
            const lecturerId = req.user.id;

            // Find the assignment
            const assignment = await Assignment.findOne({
                where: { assignment_id: assignmentId, lecturer_id: lecturerId },
            });

            if (!assignment) {
                throw createError.Forbidden({
                    message: "You are not authorized to delete this assignment or it does not exist.",
                });
            }

            // Delete the assignment
            await assignment.destroy();

            res.status(200).send({
                message: "Assignment deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    },

    //admin summarry
    fetchAssignmentSummary: async (req, res) => {
        const { assignmentId } = req.params;

        try {
            // Fetch total submissions for the assignment
            const totalSubmissions = await Submission.count({
                where: { assignment_id: assignmentId },
            });

            // Calculate the mean grade
            const meanGradeResult = await Submission.findOne({
                where: { assignment_id: assignmentId },
                attributes: [[Sequelize.fn('AVG', Sequelize.col('grade')), 'meanGrade']],
            });

            const meanGrade = meanGradeResult ? meanGradeResult.dataValues.meanGrade : null;

            res.status(200).json({
                assignmentId,
                totalSubmissions,
                meanGrade: meanGrade ? parseFloat(meanGrade).toFixed(2) : 'N/A',
            });
        } catch (error) {
            console.error("Error fetching assignment summary:", error.message);
            res.status(500).json({ message: "Error fetching assignment summary." });
        }
    },

}
