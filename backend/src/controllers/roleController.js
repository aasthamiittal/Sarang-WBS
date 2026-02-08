const Role = require('../models/Role');
const { getDefaultPermissions, MODULES } = require('../config/permissions');

exports.getPermissionModules = (req, res) => {
  res.json({ success: true, data: MODULES });
};

exports.addRole = async (req, res, next) => {
  try {
    const body = { ...req.body, customerId: req.tenantId };
    if (body.permissions == null) body.permissions = getDefaultPermissions();
    const role = await Role.create(body);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({ customerId: req.tenantId }).sort({ name: 1 });
    res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, customerId: req.tenantId },
      req.body,
      { new: true }
    );
    if (!role) return res.status(404).json({ success: false, message: 'Role not found.' });
    res.json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findOneAndDelete({ _id: req.params.id, customerId: req.tenantId });
    if (!role) return res.status(404).json({ success: false, message: 'Role not found.' });
    res.json({ success: true, message: 'Role deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.updateRolePermissions = async (req, res, next) => {
  try {
    const { roleId, permissions } = req.body;
    if (!roleId || !permissions || typeof permissions !== 'object') {
      return res.status(400).json({ success: false, message: 'roleId and permissions object required.' });
    }
    const role = await Role.findOneAndUpdate(
      { _id: roleId, customerId: req.tenantId },
      { permissions },
      { new: true }
    );
    if (!role) return res.status(404).json({ success: false, message: 'Role not found.' });
    res.json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
};
