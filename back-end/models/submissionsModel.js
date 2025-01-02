module.exports = (sequelize, DataTypes) => {

    const Submission = sequelize.define("submissions", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        assignment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "assignments",
                key: "assignment_id",
            },
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        file_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        graded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        submitted_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    return Submission;
};
