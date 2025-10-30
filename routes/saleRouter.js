const express = require('express');
const saleController = require('../controllers/saleController.js');

const saleRouter = express.Router();

saleRouter.get('/addToCart/:id', saleController.addToCart);
saleRouter.get('/getCart', saleController.getCart);
saleRouter.post('/cartToHistory', saleController.cartToHistory);
saleRouter.get('/getHistory/:id', saleController.getHistory);

module.exports = saleRouter;