const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getOrCreateInventory = async (productId, warehouseId, binId = null) => {
  let inv = await Inventory.findOne({ product: productId, warehouse: warehouseId });
  if (!inv) inv = await Inventory.create({ product: productId, warehouse: warehouseId, bin: binId, quantity: 0 });
  return inv;
};

exports.addStockInward = async (req, res, next) => {
  try {
    const { product, warehouse, quantity, referenceNo, reason } = req.body;
    const inv = await getOrCreateInventory(product, warehouse);
    inv.quantity += Number(quantity);
    await inv.save();
    await StockMovement.create({
      product,
      warehouse,
      type: 'inward',
      quantity: Number(quantity),
      referenceNo,
      reason,
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, data: inv, message: 'Stock inward recorded.' });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentStock = async (req, res, next) => {
  try {
    const warehouse = req.query.warehouse;
    const query = warehouse ? { warehouse } : {};
    const stock = await Inventory.find(query)
      .populate('product', 'sku name reorderLevel')
      .populate('warehouse', 'code name')
      .populate('bin', 'code zone')
      .lean();
    res.json({ success: true, data: stock });
  } catch (err) {
    next(err);
  }
};

exports.getStockMovement = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.warehouse) filter.warehouse = req.query.warehouse;
    if (req.query.type) filter.type = req.query.type;
    const [data, total] = await Promise.all([
      StockMovement.find(filter)
        .populate('product', 'sku name')
        .populate('warehouse', 'code name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StockMovement.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.addStockAdjustment = async (req, res, next) => {
  try {
    const { product, warehouse, quantity, reason } = req.body;
    const inv = await getOrCreateInventory(product, warehouse);
    const adj = Number(quantity);
    inv.quantity += adj;
    if (inv.quantity < 0) inv.quantity = 0;
    await inv.save();
    await StockMovement.create({
      product,
      warehouse,
      type: 'adjustment',
      quantity: adj,
      reason: reason || 'Manual adjustment',
      createdBy: req.user?.id,
    });
    res.status(201).json({ success: true, data: inv, message: 'Stock adjusted.' });
  } catch (err) {
    next(err);
  }
};

exports.getLowStock = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate('product', 'sku name reorderLevel')
      .populate('warehouse', 'code name')
      .lean();
    const low = inventories.filter((inv) => inv.product && inv.quantity <= (inv.product.reorderLevel || 0));
    res.json({ success: true, data: low });
  } catch (err) {
    next(err);
  }
};
