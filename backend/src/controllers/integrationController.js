const Integration = require('../models/Integration');

exports.addIntegration = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const integration = await Integration.create(body);
    res.status(201).json({ success: true, data: integration });
  } catch (err) {
    next(err);
  }
};

exports.getIntegrations = async (req, res, next) => {
  try {
    const data = await Integration.find({ customerId: req.tenantId }).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.updateIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    );
    if (!integration) return res.status(404).json({ success: false, message: 'Integration not found.' });
    res.json({ success: true, data: integration });
  } catch (err) {
    next(err);
  }
};

exports.deleteIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.findOneAndDelete({ _id: req.params.id, customerId: req.tenantId });
    if (!integration) return res.status(404).json({ success: false, message: 'Integration not found.' });
    res.json({ success: true, message: 'Integration deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.retryIntegration = async (req, res, next) => {
  try {
    const integration = await Integration.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      { $set: { lastError: null }, $inc: { retryCount: 1 }, lastSyncAt: new Date() },
      { new: true }
    );
    if (!integration) return res.status(404).json({ success: false, message: 'Integration not found.' });
    res.json({ success: true, data: integration, message: 'Retry triggered. lastError cleared.' });
  } catch (err) {
    next(err);
  }
};
