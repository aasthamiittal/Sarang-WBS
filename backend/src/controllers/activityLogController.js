const ActivityLog = require('../models/ActivityLog');

exports.getActivityLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find().populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(),
    ]);
    res.json({ success: true, data: logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};
