const Order = require('../models/Order');
const Bin = require('../models/Bin');
const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const InventoryLedger = require('../models/InventoryLedger');
const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

const tenantFilter = (req) => ({ customerId: req.tenantId, deletedAt: null });

exports.addWarehouse = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const warehouse = await Warehouse.create(body);
    res.status(201).json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

exports.getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find(tenantFilter(req)).sort({ code: 1 }).lean();
    res.json({ success: true, data: warehouses });
  } catch (err) {
    next(err);
  }
};

exports.updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    );
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    res.json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

exports.deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    res.json({ success: true, message: 'Warehouse deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.getPickingList = async (req, res, next) => {
  try {
    const status = req.query.status || 'confirmed';
    const orders = await Order.find({ ...tenantFilter(req), status: { $in: ['confirmed', 'picking'] } })
      .populate('warehouse', 'code name')
      .populate('items.product', 'sku name')
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.addPacking = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.body.orderId, ...tenantFilter(req) },
      { status: 'packing' },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order, message: 'Order marked for packing.' });
  } catch (err) {
    next(err);
  }
};

exports.addDispatch = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.body.orderId, ...tenantFilter(req) },
      { status: 'dispatched' },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order, message: 'Order dispatched.' });
  } catch (err) {
    next(err);
  }
};

exports.addBin = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const bin = await Bin.create(body);
    res.status(201).json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
};

exports.getBins = async (req, res, next) => {
  try {
    const filter = { customerId: req.tenantId };
    if (req.query.warehouse) filter.warehouse = req.query.warehouse;
    const bins = await Bin.find(filter)
      .populate('warehouse', 'code name')
      .sort({ code: 1 })
      .lean();
    res.json({ success: true, data: bins });
  } catch (err) {
    next(err);
  }
};

exports.updateBin = async (req, res, next) => {
  try {
    const bin = await Bin.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    ).populate('warehouse');
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found.' });
    res.json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
};

exports.deleteBin = async (req, res, next) => {
  try {
    const bin = await Bin.findOneAndDelete({ _id: req.params.id, customerId: req.tenantId });
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found.' });
    res.json({ success: true, message: 'Bin deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.transferStock = async (req, res, next) => {
  try {
    const { product, fromWarehouse, toWarehouse, quantity } = req.body;
    const fromInv = await Inventory.findOne({ customerId: req.tenantId, product, warehouse: fromWarehouse });
    if (!fromInv || fromInv.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock for transfer.' });
    }
    fromInv.quantity -= Number(quantity);
    await fromInv.save();
    let toInv = await Inventory.findOne({ customerId: req.tenantId, product, warehouse: toWarehouse });
    if (!toInv) toInv = await Inventory.create({ customerId: req.tenantId, product, warehouse: toWarehouse, quantity: 0 });
    toInv.quantity += Number(quantity);
    await toInv.save();
    const qty = Number(quantity);
    const createdBy = req.user?.id || req.user?.userId;
    await Promise.all([
      StockMovement.create([
        { customerId: req.tenantId, product, warehouse: fromWarehouse, type: 'transfer', quantity: -qty, reason: 'Transfer out', createdBy },
        { customerId: req.tenantId, product, warehouse: toWarehouse, type: 'transfer', quantity: qty, reason: 'Transfer in', createdBy },
      ]),
      InventoryLedger.create([
        { customerId: req.tenantId, product, warehouse: fromWarehouse, quantityDelta: -qty, type: 'transfer_out', reason: 'Transfer out', createdBy },
        { customerId: req.tenantId, product, warehouse: toWarehouse, quantityDelta: qty, type: 'transfer_in', reason: 'Transfer in', createdBy },
      ]),
    ]);
    res.status(201).json({ success: true, message: 'Stock transferred.', data: { from: fromInv, to: toInv } });
  } catch (err) {
    next(err);
  }
};
