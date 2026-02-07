const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const auth = require('../middleware/auth');

router.post('/add-integration', auth, integrationController.addIntegration);
router.get('/get-integrations', auth, integrationController.getIntegrations);
router.put('/update-integration/:id', auth, integrationController.updateIntegration);
router.delete('/delete-integration/:id', auth, integrationController.deleteIntegration);

module.exports = router;
