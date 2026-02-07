const Return = require('../models/Return');

exports.addReturn = async (req, res, next) => {
  try {
    const ret = await Return.create(req.body);
    res.status(201).json({ success: true, data: ret });
  } catch (err) {
    next(err);
  }
};

exports.getReturns = async (req, res, next) => {
  try {
    const returns = await Return.find().populate('order').populate('items.product', 'sku name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: returns });
  } catch (err) {
    next(err);
  }
};

exports.addQualityCheck = async (req, res, next) => {
  try {
    const { returnId, itemIndex, qualityStatus } = req.body;
    const ret = await Return.findById(returnId);
    if (!ret) return res.status(404).json({ success: false, message: 'Return not found.' });
    if (ret.items[itemIndex]) ret.items[itemIndex].qualityStatus = qualityStatus;
    await ret.save();
    if (req.body.status) {
      ret.status = req.body.status;
      await ret.save();
    }
    res.json({ success: true, data: ret });
  } catch (err) {
    next(err);
  }
};

exports.restockItem = async (req, res, next) => {
  try {
    const ret = await Return.findByIdAndUpdate(req.body.returnId, { status: 'restocked' }, { new: true });
    if (!ret) return res.status(404).json({ success: false, message: 'Return not found.' });
    res.json({ success: true, data: ret, message: 'Item restocked.' });
  } catch (err) {
    next(err);
  }
};

exports.getRtoOrders = async (req, res, next) => {
  try {
    const returns = await Return.find({ rtoTracking: { $exists: true, $ne: '' } })
      .populate('order')
      .populate('items.product', 'sku name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: returns });
  } catch (err) {
    next(err);
  }
};
