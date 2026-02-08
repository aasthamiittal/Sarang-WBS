const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const InventoryLedger = require('../models/InventoryLedger');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getOrCreateInventory = async (productId, warehouseId, customerId, binId = null) => {
  let inv = await Inventory.findOne({ customerId, product: productId, warehouse: warehouseId });
  if (!inv) inv = await Inventory.create({ customerId, product: productId, warehouse: warehouseId, bin: binId, quantity: 0 });
  return inv;
};

exports.addStockInward = async (req, res, next) => {
  try {
    const { product, warehouse, quantity, referenceNo, reason } = req.body;
    const qty = Number(quantity);
    if (qty <= 0) return res.status(400).json({ success: false, message: 'Inward quantity must be positive.' });
    const inv = await getOrCreateInventory(product, warehouse, req.tenantId);
    inv.quantity += qty;
    await inv.save();
    const createdBy = req.user?.id || req.user?.userId;
    await Promise.all([
      StockMovement.create({
        customerId: req.tenantId,
        product,
        warehouse,
        type: 'inward',
        quantity: qty,
        referenceNo,
        reason,
        createdBy,
      }),
      InventoryLedger.create({
        customerId: req.tenantId,
        product,
        warehouse,
        quantityDelta: qty,
        type: 'inward',
        referenceNo,
        reason,
        createdBy,
      }),
    ]);
    res.status(201).json({ success: true, data: inv, message: 'Stock inward recorded.' });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentStock = async (req, res, next) => {
  try {
    const warehouse = req.query.warehouse;
    const query = { customerId: req.tenantId };
    if (warehouse) query.warehouse = warehouse;
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
    const filter = { customerId: req.tenantId };
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
    const inv = await getOrCreateInventory(product, warehouse, req.tenantId);
    const adj = Number(quantity);
    const newQty = inv.quantity + adj;
    if (newQty < 0) {
      return res.status(400).json({
        success: false,
        message: `Negative stock not allowed. Current: ${inv.quantity}, adjustment: ${adj}.`,
      });
    }
    inv.quantity = newQty;
    await inv.save();
    const createdBy = req.user?.id || req.user?.userId;
    await Promise.all([
      StockMovement.create({
        customerId: req.tenantId,
        product,
        warehouse,
        type: 'adjustment',
        quantity: adj,
        reason: reason || 'Manual adjustment',
        createdBy,
      }),
      InventoryLedger.create({
        customerId: req.tenantId,
        product,
        warehouse,
        quantityDelta: adj,
        type: 'adjustment',
        reason: reason || 'Manual adjustment',
        createdBy,
      }),
    ]);
    res.status(201).json({ success: true, data: inv, message: 'Stock adjusted.' });
  } catch (err) {
    next(err);
  }
};

exports.getLowStock = async (req, res, next) => {
  try {
    const inventories = await Inventory.find({ customerId: req.tenantId })
      .populate('product', 'sku name reorderLevel')
      .populate('warehouse', 'code name')
      .lean();
    const low = inventories.filter((inv) => inv.product && inv.quantity <= (inv.product.reorderLevel || 0));
    res.json({ success: true, data: low });
  } catch (err) {
    next(err);
  }
};
