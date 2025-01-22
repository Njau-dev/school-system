const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../helpers/jwtHelpers');
const auth = require('../helpers/jwtHelpers')


//routes
routes.post('/register', userController.registerUser);

routes.post('/login', userController.loginUser);

//admin
routes.get('/getallusers', verifyAccessToken, auth.restrict('student', 'lecturer'), userController.getAllUsers);

routes.get('/getuser', verifyAccessToken, userController.getUserById);

//admin update user role
routes.patch('/updateuser/:userId', verifyAccessToken, userController.updateUserRole);

//admin
routes.delete('/deleteuser/:userId', verifyAccessToken, auth.restrict('admin'), userController.deleteUser);

module.exports = routes;