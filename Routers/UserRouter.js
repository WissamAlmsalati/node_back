// Routers/UserRouter.js
const express = require('express');
const userController = require('../Controller/UserController');

const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;