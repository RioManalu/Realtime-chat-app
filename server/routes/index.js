const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// create api
router.post('/register', userController.userRegister);
router.post('/check-email', userController.checkEmail);
router.post('/check-password', userController.checkPassword);
router.get('/user-details', userController.userDetails);
router.get('/logout', userController.logout);
router.post('/update-user', userController.updateUserDetails);
router.post('/search-user', userController.searchUser);

module.exports = router;