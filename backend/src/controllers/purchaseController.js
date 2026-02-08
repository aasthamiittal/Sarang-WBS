const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.addPurchaseOrder = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const purchase = await Purchase.create(body);
    res.status(201).json({ success: true, data: purchase });
  } catch (err) {
    next(err);
  }
};

exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { customerId: req.tenantId };
    const [data, total] = await Promise.all([
      Purchase.find(filter)
        .populate('supplier', 'code name')
        .populate('warehouse', 'code name')
        .populate('items.product', 'sku name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Purchase.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getForecast = async (req, res, next) => {
  try {
    const products = await Product.find({ customerId: req.tenantId, isActive: true, deletedAt: null }).select('sku name reorderLevel').lean();
    const forecast = products.map((p) => ({ product: p, suggestedOrder: Math.max(0, (p.reorderLevel || 0) * 2) }));
    res.json({ success: true, data: forecast });
  } catch (err) {
    next(err);
  }
};

exports.getReorderLevels = async (req, res, next) => {
  try {
    const products = await Product.find({ customerId: req.tenantId, isActive: true, deletedAt: null }).select('sku name reorderLevel').lean();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
