const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            }
        },
        role: {
            type: DataTypes.ENUM('student', 'lecturer', 'admin'),
            defaultValue: 'student',
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        timestamps: true,
    });

    // Hash password before saving
    User.beforeCreate(async (user) => {
        try {
            const salt = await bcrypt.genSalt(12);
            const hashedPwd = await bcrypt.hash(user.password, salt);
            user.password = hashedPwd;
        } catch (error) {
            throw new Error("Error encrypting password");
        }
    });

    // Function to compare the entered password with the saved hashed password
    User.prototype.isValidPassword = async function (password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw error;
        }
    };

    return User;
};
