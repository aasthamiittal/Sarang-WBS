const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');

router.post('/add-role', auth, roleController.addRole);
router.get('/get-roles', auth, roleController.getRoles);
router.put('/update-role/:id', auth, roleController.updateRole);
router.delete('/delete-role/:id', auth, roleController.deleteRole);

module.exports = router;
