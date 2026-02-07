const Shipment = require('../models/Shipment');
const Order = require('../models/Order');

exports.selectCourier = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { order: req.body.orderId },
      { courier: req.body.courier },
      { new: true, upsert: true }
    ).populate('order');
    res.json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

exports.generateLabel = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { order: req.body.orderId },
      { labelUrl: req.body.labelUrl || '/labels/' + req.body.orderId + '.pdf', trackingNo: req.body.trackingNo },
      { new: true, upsert: true }
    ).populate('order');
    res.json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

exports.trackShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ trackingNo: req.query.trackingNo }).populate('order').lean();
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    res.json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const updates = { deliveryStatus: req.body.deliveryStatus };
    if (req.body.deliveryStatus === 'delivered') updates.deliveredAt = new Date();
    if (req.body.deliveryStatus === 'picked' || req.body.deliveryStatus === 'in_transit') updates.shippedAt = updates.shippedAt || new Date();
    const shipment = await Shipment.findOneAndUpdate(
      { order: req.body.orderId },
      updates,
      { new: true }
    ).populate('order');
    if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found.' });
    res.json({ success: true, data: shipment });
  } catch (err) {
    next(err);
  }
};
