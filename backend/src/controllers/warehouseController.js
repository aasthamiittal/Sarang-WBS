const Order = require('../models/Order');
const Bin = require('../models/Bin');
const Inventory = require('../models/Inventory');
const StockMovement = require('../models/StockMovement');
const Warehouse = require('../models/Warehouse');
const mongoose = require('mongoose');

exports.addWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

exports.getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find().sort({ code: 1 }).lean();
    res.json({ success: true, data: warehouses });
  } catch (err) {
    next(err);
  }
};

exports.updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    res.json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

exports.deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found.' });
    res.json({ success: true, message: 'Warehouse deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.getPickingList = async (req, res, next) => {
  try {
    const status = req.query.status || 'confirmed';
    const orders = await Order.find({ status: { $in: ['confirmed', 'picking'] } })
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
    const order = await Order.findByIdAndUpdate(req.body.orderId, { status: 'packing' }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order, message: 'Order marked for packing.' });
  } catch (err) {
    next(err);
  }
};

exports.addDispatch = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.body.orderId, { status: 'dispatched' }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order, message: 'Order dispatched.' });
  } catch (err) {
    next(err);
  }
};

exports.addBin = async (req, res, next) => {
  try {
    const bin = await Bin.create(req.body);
    res.status(201).json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
};

exports.getBins = async (req, res, next) => {
  try {
    const bins = await Bin.find(req.query.warehouse ? { warehouse: req.query.warehouse } : {})
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
    const bin = await Bin.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('warehouse');
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found.' });
    res.json({ success: true, data: bin });
  } catch (err) {
    next(err);
  }
};

exports.deleteBin = async (req, res, next) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ success: false, message: 'Bin not found.' });
    res.json({ success: true, message: 'Bin deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.transferStock = async (req, res, next) => {
  try {
    const { product, fromWarehouse, toWarehouse, quantity } = req.body;
    const fromInv = await Inventory.findOne({ product, warehouse: fromWarehouse });
    if (!fromInv || fromInv.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock for transfer.' });
    }
    fromInv.quantity -= Number(quantity);
    await fromInv.save();
    let toInv = await Inventory.findOne({ product, warehouse: toWarehouse });
    if (!toInv) toInv = await Inventory.create({ product, warehouse: toWarehouse, quantity: 0 });
    toInv.quantity += Number(quantity);
    await toInv.save();
    await StockMovement.create([
      { product, warehouse: fromWarehouse, type: 'transfer', quantity: -Number(quantity), reason: 'Transfer out', createdBy: req.user?.id },
      { product, warehouse: toWarehouse, type: 'transfer', quantity: Number(quantity), reason: 'Transfer in', createdBy: req.user?.id },
    ]);
    res.status(201).json({ success: true, message: 'Stock transferred.', data: { from: fromInv, to: toInv } });
  } catch (err) {
    next(err);
  }
};
