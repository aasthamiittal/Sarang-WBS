const Integration = require('../models/Integration');

exports.addIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.create(req.body);
    res.status(201).json({ success: true, data: integration });
  } catch (err) {
    next(err);
  }
};

exports.getIntegrations = async (req, res, next) => {
  try {
    const data = await Integration.find().lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!integration) return res.status(404).json({ success: false, message: 'Integration not found.' });
    res.json({ success: true, data: integration });
  } catch (err) {
    next(err);
  }
};

exports.deleteIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.findByIdAndDelete(req.params.id);
    if (!integration) return res.status(404).json({ success: false, message: 'Integration not found.' });
    res.json({ success: true, message: 'Integration deleted.' });
  } catch (err) {
    next(err);
  }
};
