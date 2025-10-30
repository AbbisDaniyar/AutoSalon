const express = require('express');
const clientController = require('../controllers/clientController.js');

const clientRouter = express.Router();

clientRouter.get('/add', clientController.addClient);
clientRouter.post('/add', clientController.postAddClient);
clientRouter.get('/edit/:id', clientController.editClient);
clientRouter.post('/edit', clientController.postEditClient);
clientRouter.get('/', clientController.getClients);

module.exports = clientRouter;