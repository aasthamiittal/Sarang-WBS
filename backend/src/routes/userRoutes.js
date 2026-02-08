const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/add-user', auth, enforceTenant, requireAdmin, userController.addUser);
router.get('/get-users', auth, enforceTenant, requireAdmin, userController.getUsers);
router.get('/get-user/:id', auth, enforceTenant, requireAdmin, userController.getUser);
router.put('/update-user/:id', auth, enforceTenant, requireAdmin, userController.updateUser);
router.delete('/delete-user/:id', auth, enforceTenant, requireAdmin, userController.deleteUser);

module.exports = router;
