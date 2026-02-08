const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/add-role', auth, enforceTenant, requireAdmin, roleController.addRole);
router.get('/get-roles', auth, enforceTenant, requireAdmin, roleController.getRoles);
router.get('/get-permission-modules', auth, enforceTenant, requireAdmin, roleController.getPermissionModules);
router.put('/update-role/:id', auth, enforceTenant, requireAdmin, roleController.updateRole);
router.delete('/delete-role/:id', auth, enforceTenant, requireAdmin, roleController.deleteRole);
router.put('/update-role-permissions', auth, enforceTenant, requireAdmin, roleController.updateRolePermissions);

module.exports = router;
