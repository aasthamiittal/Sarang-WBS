const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-integration', auth, enforceTenant, checkPermission('integrations', 'write'), integrationController.addIntegration);
router.get('/get-integrations', auth, enforceTenant, checkPermission('integrations', 'read'), integrationController.getIntegrations);
router.put('/update-integration/:id', auth, enforceTenant, checkPermission('integrations', 'write'), integrationController.updateIntegration);
router.delete('/delete-integration/:id', auth, enforceTenant, checkPermission('integrations', 'write'), integrationController.deleteIntegration);
router.post('/retry-integration/:id', auth, enforceTenant, checkPermission('integrations', 'write'), integrationController.retryIntegration);

module.exports = router;
