const winston = require('winston');
const logger = require('../../main/common/logger');
// const mongo = require('mongodb');

const fromHours = -24 * 7; // Default to a week back (Winston query will default to 24 hours)

exports.list = function(req, res, next) {

  // https://github.com/winstonjs/winston#querying-logs
  const options = {
    start: req.query['start'] || 0,
    limit: req.query['limit'] || 100,
    order: req.query['order'] || 'desc'
    // fields: ['message', 'level'],
    // type: 'console'
    // type: 'mongodb'
  };

  const fields = typeof req.query['fields'] == 'string' ? req.param('fields') : null;
  if (fields) options.fields = fields.split(',');

  const from = req.query['from'] ? new Date(req.param('from')) : new Date().setHours(fromHours);
  if (from) options.from = from;

  const until = req.query['until'] ? new Date(req.param('until')) : null;
  if (until) options.until = until;

  logger.transports.mongodb.query(options, function (err, results) {
    if (err) {
      logger.error(err);
      return res.status(500).json({ success: false, errors: [err.message] });
    }

    return res.json({ success: true, data: results });
  });

};
