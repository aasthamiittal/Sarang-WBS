/**
 * Central audit logger. Logs are immutable (insert-only).
 * Use for entity changes: before/after, userId, customerId, correlationId.
 */
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');

function getCorrelationId(req) {
  return req?.headers?.['x-correlation-id'] || req?.correlationId || crypto.randomUUID();
}

async function log(req, { action, entity, entityId, before, after, details }) {
  const payload = {
    customerId: req.tenantId || req.user?.customerId,
    user: req.user?.userId,
    action,
    entity: entity || undefined,
    entityId: entityId || undefined,
    before: before || undefined,
    after: after || undefined,
    details: details || undefined,
    ip: req.ip || req.connection?.remoteAddress,
    correlationId: getCorrelationId(req),
  };
  try {
    await ActivityLog.create(payload);
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}

module.exports = { log, getCorrelationId };
