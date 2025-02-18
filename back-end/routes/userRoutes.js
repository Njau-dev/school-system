const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../helpers/jwtHelpers');
const auth = require('../helpers/jwtHelpers');
const passwordController = require('../controllers/passwordController');


//routes
routes.post('/register', userController.registerUser);

routes.post('/login', userController.loginUser);

routes.get('/getuser', verifyAccessToken, userController.getUserById);

//admin - get users
routes.get('/getallusers', verifyAccessToken, auth.restrict('student', 'lecturer'), userController.getAllUsers);

//admin - update user role
routes.patch('/updateuser/:userId', verifyAccessToken, auth.restrict('student', 'lecturer'), userController.updateUserRole);

//admin - delete user
routes.delete('/deleteuser/:userId', verifyAccessToken, auth.restrict('student', 'lecturer'), userController.deleteUser);

//password routes
routes.post('/forgot-password', passwordController.forgotPassword);
routes.post('/reset-password', passwordController.resetPassword);

module.exports = routes;