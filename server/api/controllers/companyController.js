const Company = require('mongoose').model('Company');

// GET /api/companies
// List companies, paginations options
exports.list = function(req, res, next) {

  const pageOptions = {
    page: req.query['page'] || 1,
    limit: req.query['limit'] || 1000,
    sort: req.query['sort'] || 'name asc'
  };

  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach((item) => {
        filterOptions[item.id] = new RegExp(item.value, 'i');
      });
    }
  } catch (err) {
    console.log('Could not parse \'filter\' param '+ err);
  }

  Company.paginate(filterOptions, pageOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }

    return res.json(result);
  });
};
