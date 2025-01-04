const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken, restrict } = require('../helpers/jwtHelpers');

//routes
routes.post('/register', userController.registerUser);

routes.post('/login', userController.loginUser);

routes.get('/getallusers', verifyAccessToken, restrict('student', 'lecturer'), userController.getAllUsers);

routes.get('/getuser/:userId', verifyAccessToken, userController.getUserById);

routes.patch('/updateuser/:userId', verifyAccessToken, userController.updateUserRole);

routes.delete('/deleteuser/:userId', verifyAccessToken, restrict('admin'), userController.deleteUser);

module.exports = routes;