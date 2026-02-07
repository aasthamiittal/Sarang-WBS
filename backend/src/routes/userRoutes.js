const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/add-user', auth, userController.addUser);
router.get('/get-users', auth, userController.getUsers);
router.get('/get-user/:id', auth, userController.getUser);
router.put('/update-user/:id', auth, userController.updateUser);
router.delete('/delete-user/:id', auth, userController.deleteUser);

module.exports = router;
