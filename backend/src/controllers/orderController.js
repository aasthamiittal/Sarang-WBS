const Order = require('../models/Order');

const tenantFilter = (req) => ({ customerId: req.tenantId, deletedAt: null });

/** Valid next statuses per current status (order state machine). */
const VALID_TRANSITIONS = {
  created: ['pending', 'confirmed', 'cancelled'],
  pending: ['confirmed', 'cancelled'],
  confirmed: ['allocated', 'cancelled', 'backorder'],
  allocated: ['picking', 'backorder'],
  picking: ['picked'],
  picked: ['packing'],
  packing: ['packed'],
  packed: ['dispatched'],
  dispatched: ['delivered'],
  delivered: [],
  cancelled: [],
  backorder: ['allocated'],
};

exports.addOrder = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const order = await Order.create(body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { ...tenantFilter(req) };
    if (req.query.status) filter.status = req.query.status;
    const [data, total] = await Promise.all([
      Order.find(filter).populate('warehouse', 'code name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, ...tenantFilter(req) }).populate('warehouse').populate('items.product', 'sku name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const newStatus = req.body.status;
    if (!newStatus) return res.status(400).json({ success: false, message: 'status is required.' });
    const order = await Order.findOne({ _id: req.params.id, ...tenantFilter(req) })
      .populate('warehouse')
      .populate('items.product', 'sku name');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const allowed = VALID_TRANSITIONS[order.status];
    if (!Array.isArray(allowed) || !allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: ${order.status} → ${newStatus}. Allowed: ${(allowed || []).join(', ') || 'none'}.`,
      });
    }
    order.status = newStatus;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getBackorders = async (req, res, next) => {
  try {
    const orders = await Order.find({ ...tenantFilter(req), status: 'backorder' }).populate('warehouse').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getCancelledOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ ...tenantFilter(req), status: 'cancelled' }).populate('warehouse').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};
