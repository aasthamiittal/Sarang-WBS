const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const Order = require('../models/Order');
const Return = require('../models/Return');
const Purchase = require('../models/Purchase');

exports.inventoryReport = async (req, res, next) => {
  try {
    const data = await Inventory.find()
      .populate('product', 'sku name category')
      .populate('warehouse', 'code name')
      .lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.stockPurchaseReport = async (req, res, next) => {
  try {
    const type = req.query.type || 'inward';
    const data = await StockMovement.find({ type: 'inward' })
      .populate('product', 'sku name')
      .populate('warehouse', 'code name')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.stockSalesReport = async (req, res, next) => {
  try {
    const data = await StockMovement.find({ type: 'outward' })
      .populate('product', 'sku name')
      .populate('warehouse', 'code name')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.orderDispatchReport = async (req, res, next) => {
  try {
    const data = await Order.find({ status: { $in: ['dispatched', 'delivered'] } })
      .populate('warehouse', 'code name')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.customerReport = async (req, res, next) => {
  try {
    const orders = await Order.aggregate([
      { $match: {} },
      { $group: { _id: '$customerEmail', customerName: { $first: '$customerName' }, orderCount: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
      { $sort: { orderCount: -1 } },
    ]);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.returnsRtoReport = async (req, res, next) => {
  try {
    const data = await Return.find().populate('order').populate('items.product', 'sku name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.warehousePerformanceReport = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: { $in: ['dispatched', 'delivered'] } } },
      { $group: { _id: '$warehouse', count: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
      { $lookup: { from: 'warehouses', localField: '_id', foreignField: '_id', as: 'warehouse' } },
      { $unwind: '$warehouse' },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
