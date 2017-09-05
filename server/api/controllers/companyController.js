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


// GET /api/companies/:id
exports.find = function(req, res, next) {

  Company.findById(req.params.id, (err, company) => {
    if (err || !company) {
      if (err) console.log(err);
      return res.status(404).json({
        success: false,
        errors: [ err ? err.message : `company id '${req.params.id} not found'` ]
      });
    }

    return res.json({
      success: true,
      data: company
    });
  });
};


// GET /api/companies/subdomain/:subdomain
// Find Company by subdomain
exports.findBySubdomain = function(req, res, next) {

  Company.find({ subdomain:  req.params.subdomain }, (err, result) => {
    if (err || (!result && !result.length === 1)) {
      if (err) console.log(err);
      return res.status(404).json({
        success: false,
        errors: [ err ? err.message : `company subdomain '${req.params.subdomain} not found'` ]
      });
    }

    return res.json({
      success: true,
      data: result[0]
    });
  });
};


// POST /api/companies
// Add new company
exports.new = function(req, res, next) {
  if (!req.body.company || typeof req.body.company !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'company\' param is required'] });
  }

  validateCompany(req.body.company, (errValidation, company) => {
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

// PUT /api/companies
exports.updateCompany = function(req, res, next) {
  if (!req.body.company || typeof req.body.company !== 'object') {
    return res.status(409).json({ success: false, errors: ['\'company\' param is required'] });
  }

  const company = req.body.company;

  updateCompany(company, (err, data) => {
    if (err) {
      if (err) console.log(err);
      return res.json({ success: false, errors: [err.message] });
    }

    return res.json({ success: true });
  });
};


// DELETE /api/companies/:id
exports.destroy = function(req, res, next) {

  Company.findByIdAndRemove(req.params.id, (err, company) => {
    if (err || !company) {
      if (err) console.log(err);
      return res.status(404).json({
        success: false,
        errors: [ err ? err.message : `company id '${req.params.id} not found'` ]
      });
    }

    return res.json({
      success: true,
      data: company
    });
  });
};


function updateCompany(company, callback) {

  validateCompany(company, (errValdation, c) => {
    if (errValdation) return callback (errValdation);

    Company.findOneAndUpdate({ _id: c.id }, c, (err, data) => {
      if (err) return callback(err);

      return callback(null, data);
    });
  });
}

function validateCompany(company, callback) {

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
