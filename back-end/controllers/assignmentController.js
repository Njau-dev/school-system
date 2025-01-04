const db = require("../models/indexStart");
const createError = require("http-errors");

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


    // Fetch all assignments
    fetchAllAssignments: async (req, res, next) => {
        try {
            // Fetch assignments along with lecturer and grading details
            const assignments = await Assignment.findAll({
                include: [
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name", "email"],
                    },
                    {
                        model: Submission,
                        attributes: ["grade", "graded"],
                    },
                ],
            });

            const response = assignments.map((assignment) => {
                const gradedSubmissions = assignment.submissions.filter((submission) => submission.graded);

                // Calculate grading status and mean grade
                const gradingStatus = gradedSubmissions.length > 0 ? "Graded" : "Not Graded";
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
                    lecturer: assignment.lecturer,
                    gradingStatus,
                    meanGrade,
                };
            });

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    },

    fetchAssignmentsByLecturer: async (req, res, next) => {
        try {
            const lecturerId = req.params.lecturerId; // Get lecturer ID from the route parameter

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
                    lecturer: assignment.lecturer, // Includes lecturer name and email
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
                        as: 'lecturer', // Lecturer association
                        attributes: ['name', 'email'], // Lecturer details
                    },
                    {
                        model: Submission,
                        include: [
                            {
                                model: User,
                                as: 'student', // Student association
                                attributes: ['name', 'email'], // Student details
                            },
                        ],
                        attributes: ['grade', 'graded', 'student_id'], // Submission details
                    },
                ],
            });

            if (!assignment) {
                throw createError.NotFound({ message: 'Assignment not found' });
            }

            // Map student submissions to build a detailed response
            const students = assignment.submissions.map((submission) => ({
                id: submission.student?.user_id, // Student ID
                name: submission.student?.name, // Student name
                email: submission.student?.email, // Student email
                hasSubmitted: true, // Submission exists
                grade: submission.grade, // Grade
                graded: submission.graded, // Graded status
            }));

            // Build response object
            const response = {
                id: assignment.assignment_id,
                title: assignment.title,
                description: assignment.description,
                createdAt: assignment.created_at,
                lecturer: assignment.lecturer, // Lecturer details
                students, // Students and their submission details
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

}
