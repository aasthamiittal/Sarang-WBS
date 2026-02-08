const User = require('../models/User');

const tenantFilter = (req) => ({ customerId: req.tenantId, deletedAt: null });

exports.addUser = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    const user = await User.create(body);
    const populated = await User.findById(user._id).populate('role');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find(tenantFilter(req)).populate('role').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, ...tenantFilter(req) }).populate('role');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    ).populate('role');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    next(err);
  }
};
