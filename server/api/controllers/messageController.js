
// GET /api/messages/public1
exports.getPublicMessage1 = function(req, res, next) {
  return res.json({
    message: 'public message 1 from /api/messages/public1'
  });
};

// GET /api/messages/private1
exports.getPrivateMessage1 = function(req, res, next) {
  return res.json({
    message: 'Authorized: private message 1 from /api/messages/private1'
  });
};

// GET /api/messages/admin1
exports.getAdminMessage1 = function(req, res, next) {
  return res.json({
    message: 'Authorized - Roles [\'Admin\',\'SiteAdmin\']: admin message 1 from /api/messages/admin1'
  });
};
