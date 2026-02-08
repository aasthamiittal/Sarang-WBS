const Product = require('../models/Product');
const { log } = require('../services/auditLog');

const tenantFilter = (req) => ({ customerId: req.tenantId, deletedAt: null });

exports.addProduct = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const product = await Product.create(body);
    await log(req, { action: 'create', entity: 'Product', entityId: product._id, after: body });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const filter = { ...tenantFilter(req) };
    if (req.query.search) {
      filter.$or = [{ sku: new RegExp(req.query.search, 'i') }, { name: new RegExp(req.query.search, 'i') }];
    }
    const [data, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, ...tenantFilter(req) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const existing = await Product.findOne({ _id: req.params.id, ...tenantFilter(req) });
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
    const before = existing.toObject();
    const body = { ...req.body };
    delete body.customerId;
    const product = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    await log(req, { action: 'update', entity: 'Product', entityId: product._id, before, after: product.toObject() });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, ...tenantFilter(req) });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await Product.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
    await log(req, { action: 'delete', entity: 'Product', entityId: product._id });
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};
