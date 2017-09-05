const Company = require('mongoose').model('Company');
const subdomains = require('../../main/common/sub-domains');

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


// POST /api/companies
// Add new company
exports.new = function(req, res, next) {
  if (!req.body.company || typeof req.body.company !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'company\' param is required'] });
  }

  validateCustomer(req.body.company, (errValidation, company) => {
    if (errValidation) {
      console.log(err);
      return res.json({ success: false, errors: [errValidation.message] });
    }

    const newCompany = new Company(company);
    newCompany.save((err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, errors: [err.message] });
      }

      subdomains.add(req.app, company.subdomain);

      return res.json({ success: true });
    });
  });
};


function validateCustomer(company, callback) {

  if (typeof company.name === 'string') {
    company.name = company.name.trim();
    if (company.name.length === 0)
      return callback(new Error('company.name length is 0'));
  } else {
    return callback(new Error('company.name is required'));
  }

  if (typeof company.subdomain === 'string') {
    company.subdomain = company.subdomain.trim();
    if (company.subdomain.length === 0)
      return callback(new Error('company.subdomain length is 0'));
  } else {
    return callback(new Error('company.subdomain is required'));
  }

  return callback(null, company);
}
