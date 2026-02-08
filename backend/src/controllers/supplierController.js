const Supplier = require('../models/Supplier');

const tenantFilter = (req) => ({ customerId: req.tenantId, deletedAt: null });

exports.addSupplier = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const supplier = await Supplier.create(body);
    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    next(err);
  }
};

exports.getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find(tenantFilter(req)).sort({ code: 1 }).lean();
    res.json({ success: true, data: suppliers });
  } catch (err) {
    next(err);
  }
};

exports.updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    );
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found.' });
    res.json({ success: true, data: supplier });
  } catch (err) {
    next(err);
  }
};

exports.deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found.' });
    res.json({ success: true, message: 'Supplier deleted.' });
  } catch (err) {
    next(err);
  }
};
