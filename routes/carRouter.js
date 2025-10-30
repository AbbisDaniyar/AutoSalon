const express = require('express');
const carController = require('../controllers/carController.js');

const carRouter = express.Router();

carRouter.get('/add', carController.addCar);
carRouter.post('/add', carController.postAddCar);
carRouter.get('/edit/:id', carController.editCar);
carRouter.post('/edit', carController.postEditCar);
carRouter.post('/delete/:id', carController.deleteCar);
carRouter.get('/', carController.getCars);

module.exports = carRouter;