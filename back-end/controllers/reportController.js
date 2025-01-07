const db = require("../models/indexStart");
const createError = require("http-errors");

const User = db.users;
const Report = db.reports;

module.exports = {

    addReport: async (req, res) => {
        const student_id = req.params.studentId;
        const { report_text } = req.body;
        const lecturer_id = req.user.id; // Assuming req.user contains the logged-in lecturer's ID

        // console.log(lecturerId);

        try {
            // Check if the student exists
            const student = await User.findOne({ where: { user_id: student_id, role: "student" } });
            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            // Create the report
            const report = await Report.create({
                student_id,
                lecturer_id,
                report_text,
            });

            res.status(201).json({
                message: "Report added successfully.",
                report,
            });
        } catch (error) {
            console.error("Error adding report:", error.message);
            res.status(500).json({ message: "Error adding report." });
        }
    },


    //fetching
    // 1. Student fetches their own report
    fetchStudentReport: async (req, res) => {
        const { id: studentId } = req.user; // Assuming `req.user` has authenticated user's ID

        try {
            const report = await Report.findOne({
                where: { student_id: studentId },
                include: [
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name", "email"],
                    },
                ],
            });

            if (!report) {
                return res.status(404).json({ message: "No report found for this student." });
            }

            res.status(200).json({ report });
        } catch (error) {
            console.error("Error fetching student report:", error.message);
            res.status(500).json({ message: "Error fetching report." });
        }
    },

    // 2. Lecturer fetches reports they gave
    fetchLecturerReports: async (req, res) => {
        const { id: lecturerId } = req.user;

        try {
            const reports = await Report.findAll({
                where: { lecturer_id: lecturerId },
                include: [
                    {
                        model: User,
                        as: "student",
                        attributes: ["name", "email"], // Include student's details
                    },
                ],
            });

            res.status(200).json({ reports });
        } catch (error) {
            console.error("Error fetching lecturer reports:", error.message);
            res.status(500).json({ message: "Error fetching reports." });
        }
    },

    // 3. Admin fetches all reports
    fetchAllReports: async (req, res) => {
        try {
            const reports = await Report.findAll({
                include: [
                    {
                        model: User,
                        as: "student",
                        attributes: ["name", "email"], // Include student's details
                    },
                    {
                        model: User,
                        as: "lecturer",
                        attributes: ["name", "email"], // Include lecturer's details
                    },
                ],
            });

            res.status(200).json({ reports });
        } catch (error) {
            console.error("Error fetching all reports:", error.message);
            res.status(500).json({ message: "Error fetching reports." });
        }
    },
}