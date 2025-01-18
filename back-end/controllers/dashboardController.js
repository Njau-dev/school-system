const db = require("../models/indexStart");
const createError = require("http-errors");
const { Op, sequelize } = require('../models/indexStart');
const { fn, col, literal } = require("sequelize");

const Assignment = db.assignments;
const User = db.users;
const Submission = db.submissions;
const Report = db.reports;

module.exports = {

    // Student Dashboard
    studentDashboard: async (req, res, next) => {
        const user_id = req.user.id;

        try {
            // Fetch student name
            const student = await User.findOne({
                where: { user_id },
                attributes: ['name'],
            });

            if (!student) {
                return next(createError(404, "Student not found."));
            }

            // Fetch total assignments
            const totalAssignments = await Assignment.count();

            // Fetch total submissions
            const totalSubmissions = await Submission.count({
                where: { student_id: user_id },
            });

            // Calculate average grade
            const averageGrade = await Submission.findOne({
                where: { student_id: user_id, grade: { [Op.ne]: null } },
                attributes: [[sequelize.fn('AVG', sequelize.col('grade')), 'avgGrade']],
                raw: true,
            });

            res.status(200).json({
                studentName: student.name,
                totalAssignments,
                totalSubmissions,
                averageGrade: averageGrade ? parseFloat(averageGrade.avgGrade) : 0,
            });
        } catch (error) {
            console.error("Error fetching student dashboard:", error.message);
            next(createError(500, "Error fetching student dashboard."));
        }
    },

    // Lecturer Dashboard
    lecturerDashboard: async (req, res, next) => {
        const user_id = req.user.id;

        try {
            // Total students taught by the lecturer
            const totalStudents = await Submission.count({
                include: [
                    {
                        model: Assignment,
                        as: 'assignment',
                        where: { lecturer_id: user_id },
                    },
                ],
                distinct: true,
                col: 'student_id',
            });

            // Total assignments created by the lecturer
            const totalAssignments = await Assignment.count({
                where: { lecturer_id: user_id },
            });

            // Pending reviews (ungraded submissions)
            const pendingReviews = await Submission.count({
                include: [
                    {
                        model: Assignment,
                        as: 'assignment',
                        where: { lecturer_id: user_id },
                    },
                ],
                where: { graded: false },
            });

            // Total reports authored by the lecturer
            const totalReports = await Report.count({
                where: { lecturer_id: user_id },
            });

            res.status(200).json({
                totalStudents,
                totalAssignments,
                pendingReviews,
                totalReports,
            });
        } catch (error) {
            console.error("Error fetching lecturer dashboard:", error.message);
            next(createError(500, "Error fetching lecturer dashboard."));
        }
    },

    // Admin Dashboard
    adminDashboard: async (req, res, next) => {
        try {
            // Total lecturers
            const totalLecturers = await User.count({ where: { role: 'lecturer' } });

            // Total students
            const totalStudents = await User.count({ where: { role: 'student' } });

            // Total assignments
            const totalAssignments = await Assignment.count();

            // Total submissions
            const totalSubmissions = await Submission.count();

            res.status(200).json({
                totalLecturers,
                totalStudents,
                totalAssignments,
                totalSubmissions,
            });
        } catch (error) {
            console.error("Error fetching admin dashboard:", error.message);
            next(createError(500, "Error fetching admin dashboard."));
        }
    },

    //student chart data
    getChartData: async (req, res, next) => {
        const studentId = req.user.id;

        try {
            // Fetch grades and assignment titles
            const gradesData = await Submission.findAll({
                where: { student_id: studentId, grade: { [Op.ne]: null } },
                include: [
                    {
                        model: Assignment,
                        as: "assignment",
                        attributes: ["title"],
                    },
                ],
                attributes: ["grade"],
                raw: true,
            });

            if (!gradesData.length) {
                throw createError(404, "No grades found for the student.");
            }

            const grades = gradesData.map((entry) => entry.grade);
            const assignments = gradesData.map((entry) => entry["assignment.title"]);

            // Calculate average grades per week
            const gradeTrendData = await Submission.findAll({
                where: { student_id: studentId, grade: { [Op.ne]: null } },
                attributes: [
                    [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%u"), "week"], // Year-week format
                    [sequelize.fn("AVG", sequelize.col("grade")), "avgGrade"],
                ],
                group: ["week"],
                order: [["week", "ASC"]],
                raw: true,
            });

            const gradeTrend = gradeTrendData.map((entry) => parseFloat(entry.avgGrade));
            const dates = gradeTrendData.map((entry) => entry.week);

            res.status(200).json({
                grades,
                assignments,
                gradeTrend,
                dates,
            });
        } catch (error) {
            next(createError(500, error.message || "Failed to fetch chart data."));
        }
    },


    lecturerDashboardCharts: async (req, res, next) => {
        const lecturer_id = req.user.id;

        try {
            // Fetch assignments created by the lecturer
            const assignments = await Assignment.findAll({
                where: { lecturer_id: lecturer_id },
                attributes: ["assignment_id", "title"],
            });

            if (!assignments || assignments.length === 0) {
                return next(createError(404, "No assignments found for this lecturer."));
            }

            // Assignment titles and IDs
            const assignmentTitles = assignments.map((assignment) => assignment.title);
            const assignmentIds = assignments.map((assignment) => assignment.assignment_id);

            // Fetch average grade for each assignment
            const gradesData = await Submission.findAll({
                where: { assignment_id: { [Op.in]: assignmentIds } },
                attributes: [
                    "assignment_id",
                    [sequelize.fn("AVG", sequelize.col("grade")), "avgGrade"],
                ],
                group: ["assignment_id"],
                raw: true,
            });

            const averageGrades = assignmentIds.map((id) => {
                const gradeData = gradesData.find((g) => g.assignment_id === id);
                return gradeData ? parseFloat(gradeData.avgGrade) : 0; // Default to 0 if no grades
            });

            // Fetch completed and pending submissions count
            const submissionCounts = await Submission.findAll({
                where: { assignment_id: { [Op.in]: assignmentIds } },
                attributes: [
                    "assignment_id",
                    [sequelize.fn("COUNT", sequelize.literal(`CASE WHEN graded = true THEN 1 ELSE NULL END`)), "completedCount"],
                    [sequelize.fn("COUNT", sequelize.literal(`CASE WHEN graded = false THEN 1 ELSE NULL END`)), "pendingCount"],
                ],
                group: ["assignment_id"],
                raw: true,
            });

            let completedSubmissions = 0;
            let pendingSubmissions = 0;

            // Sum up the counts
            submissionCounts.forEach((data) => {
                completedSubmissions += parseInt(data.completedCount, 10) || 0;
                pendingSubmissions += parseInt(data.pendingCount, 10) || 0;
            });

            // Final response
            res.status(200).json({
                assignmentTitles,
                averageGrades,
                completedSubmissions,
                pendingSubmissions,
            });
        } catch (error) {
            console.error("Error in lecturerDashboardCharts:", error.message);
            next(createError(500, "Failed to fetch lecturer dashboard chart data."));
        }
    },


    adminDashboardCharts: async (req, res, next) => {
        try {
            // Fetch total assignments count grouped by week
            const assignmentWeeklyData = await Assignment.findAll({
                attributes: [
                    // Group assignments by week based on the createdAt column
                    [fn("DATE_FORMAT", col("createdAt"), "%Y-%u"), "week"], // Example: "2024-01" for week 1 of 2024
                    [fn("COUNT", col("assignment_id")), "assignmentCount"], // Count assignments per week
                ],
                group: [literal("week")],
                order: [literal("week")], // Sort weeks chronologically
            });

            // Extract weekly data for assignments into arrays
            const assignmentCounts = assignmentWeeklyData.map((item) => parseInt(item.get("assignmentCount")));
            const timeLabels = assignmentWeeklyData.map((item) => item.get("week"));

            // Fetch total user count grouped by role
            const userRoleData = await User.findAll({
                attributes: ["role", [fn("COUNT", col("user_id")), "roleCount"]],
                group: ["role"],
            });

            // Map user role data to counts
            const roleCounts = userRoleData.reduce(
                (acc, item) => {
                    const role = item.get("role");
                    const count = parseInt(item.get("roleCount"));
                    if (role === "admin") {
                        acc.adminCount = count;
                    } else if (role === "lecturer") {
                        acc.lecturerCount = count;
                    } else if (role === "student") {
                        acc.studentCount = count;
                    }
                    return acc;
                },
                { adminCount: 0, lecturerCount: 0, studentCount: 0 } // Default counts as 0
            );

            // Final Response
            res.status(200).json({
                timeLabels, // Weekly time labels for assignments
                assignmentCounts, // Counts of assignments per week
                ...roleCounts, // Spread adminCount, lecturerCount, and studentCount
            });
        } catch (error) {
            console.error("Error in adminDashboardCharts:", error.message);
            next(createError(500, "Failed to fetch admin dashboard chart data."));
        }
    },


    fetchStudentAssignmentSummary: async (req, res, next) => {
        try {
            const user_id = req.user.id;

            // Fetch all assignments
            const assignments = await Assignment.findAll({
                include: [
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name"],
                    },
                ],
                attributes: ["assignment_id", "title", "created_at"],
                order: [["created_at", "DESC"]],
            });

            // Prepare the summary for each assignment
            const response = await Promise.all(
                assignments.map(async (assignment) => {
                    // Check if the user has a submission for the assignment
                    const submission = await Submission.findOne({
                        where: {
                            assignment_id: assignment.assignment_id,
                            student_id: user_id,
                        },
                        attributes: ["graded", "grade"],
                    });

                    return {
                        id: assignment.assignment_id,
                        title: assignment.title,
                        lecturer: assignment.lecturer.name,
                        submissionStatus: submission ? "Submitted" : "Not Submitted",
                        grade: submission && submission.graded ? submission.grade : 0,
                    };
                })
            );

            res.status(200).json({
                message: "Student assignment summary fetched successfully",
                assignments: response,
            });
        } catch (error) {
            next(error);
        }
    },


    //for lecturer and admin
    fetchStudentSummary: async (req, res, next) => {
        try {
            const totalAssignments = await Assignment.count();

            // Fetch all students
            const students = await User.findAll({
                where: { role: "student" },
                attributes: ["user_id", "name"],
                include: [
                    {
                        model: Submission,
                        as: "submissions",
                        attributes: ["grade", "assignment_id"],
                    },
                ],
            });

            // Map through students to calculate completion rate and average grade
            const studentSummaries = students.map((student) => {
                const submissions = student.submissions || [];

                // Calculate completed assignments
                const completedAssignments = submissions.length;

                // Calculate completion rate in percentage
                const completionRate = totalAssignments > 0
                    ? ((completedAssignments / totalAssignments) * 100).toFixed(2)
                    : 0;

                // Calculate average grade (only graded submissions)
                const gradedSubmissions = submissions.filter((submission) => submission.grade !== null);
                const totalGrades = gradedSubmissions.reduce((sum, sub) => sum + sub.grade, 0);
                const averageGrade = gradedSubmissions.length > 0
                    ? (totalGrades / gradedSubmissions.length).toFixed(2)
                    : 0;

                return {
                    id: student.user_id,
                    name: student.name,
                    completionRate: parseFloat(completionRate),
                    averageGrade,
                };
            });

            // Sort by highest completion rate
            studentSummaries.sort((a, b) => b.completionRate - a.completionRate);

            // Return the response
            res.status(200).json({
                message: "Student summary fetched successfully",
                students: studentSummaries,
            });
        } catch (error) {
            console.error("Error fetching student summary:", error);
            next(error);
        }
    },


};
