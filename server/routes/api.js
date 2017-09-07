const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Roles = require('../../src/shared/roles');

const messageController = require('../api/controllers/messageController');
const userController = require('../api/controllers/userController');
const companyController = require('../api/controllers/companyController');

// GET /api/messages/public1
router.get('/messages/public1', messageController.getPublicMessage1);

// GET /api/messages/private1
router.get('/messages/private1', authCheck(), messageController.getPrivateMessage1);

// GET /api/messages/admin1
router.get('/messages/admin1', authCheck([Roles.admin,Roles.siteAdmin]), messageController.getAdminMessage1);


// GET /api/users
router.get('/users', authCheck([Roles.admin,Roles.siteAdmin]), userController.list);

// GET /api/users/:id
router.get('/users/:id', authCheck([Roles.admin,Roles.siteAdmin]), userController.find);

// PUT /api/users
router.put('/users', authCheck([Roles.admin,Roles.siteAdmin]), userController.updateUser);

// PUT /api/users/password
router.put('/users/password', authCheck([Roles.admin,Roles.siteAdmin]), userController.updatePassword);

// PUT /api/users/profile
router.put('/users/profile', authCheck(), userController.updateProfile);

// PUT /api/users/profile/password
router.put('/users/profile/password', authCheck(), userController.updateProfilePassword);

// DELETE /api/users/:id
router.delete('/users/:id', authCheck([Roles.admin,Roles.siteAdmin]), userController.destroy);


// GET /api/companies
router.get('/companies', authCheck([Roles.siteAdmin]), companyController.list);

// GET /api/companies/:id
router.get('/companies/:id', authCheck([Roles.siteAdmin]), companyController.find);

// GET /api/companies/subdomain/:subdomain
router.get('/companies/subdomain/:subdomain', companyController.findBySubdomain);

// POST /api/companies
router.post('/companies', authCheck([Roles.siteAdmin]), companyController.new);

// PUT /api/companies
router.put('/companies', authCheck([Roles.siteAdmin]), companyController.updateCompany);

// DELETE /api/companies/:id
router.delete('/companies/:id', authCheck([Roles.siteAdmin]), companyController.destroy);


module.exports = router;
