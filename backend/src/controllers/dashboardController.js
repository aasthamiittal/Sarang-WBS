const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

exports.getDailySummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [ordersToday, ordersPending, lowStockCount, totalProducts] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'picking', 'packing'] } }),
      Inventory.aggregate([
        { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'p' } },
        { $unwind: '$p' },
        { $match: { $expr: { $lte: ['$quantity', { $ifNull: ['$p.reorderLevel', 0] }] } } },
        { $count: 'count' },
      ]).then((r) => (r[0] ? r[0].count : 0)),
      Product.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        ordersToday,
        ordersPending,
        lowStockCount,
        totalProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStockSnapshot = async (req, res, next) => {
  try {
    const snapshot = await Inventory.aggregate([
      { $group: { _id: '$warehouse', totalQty: { $sum: '$quantity' }, skuCount: { $sum: 1 } } },
      { $lookup: { from: 'warehouses', localField: '_id', foreignField: '_id', as: 'warehouse' } },
      { $unwind: '$warehouse' },
      { $project: { warehouse: '$warehouse.name', totalQty: 1, skuCount: 1 } },
    ]);
    res.json({ success: true, data: snapshot });
  } catch (err) {
    next(err);
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    const inventories = await Inventory.find()
      .populate('product', 'sku name reorderLevel')
      .populate('warehouse', 'code name')
      .lean();
    const lowStock = inventories.filter((inv) => inv.product && inv.quantity <= (inv.product.reorderLevel || 0));
    res.json({ success: true, data: lowStock.slice(0, 20) });
  } catch (err) {
    next(err);
  }
};
