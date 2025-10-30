const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const hbs = require('hbs');
hbs.registerHelper('eq', function(a, b) {
    return a === b;
});

const homeRouter = require('./routes/homeRouter');
const carRouter = require('./routes/carRouter');
const clientRouter = require('./routes/clientRouter');
const saleRouter = require('./routes/saleRouter');

app.use('/', homeRouter);
app.use('/cars', carRouter);
app.use('/clients', clientRouter);
app.use('/sales', saleRouter);

app.use(function(req, res) {
    res.status(404).render('404', {
        title: 'Страница не найдена - Автосалон',
        pageTitle: 'Ошибка 404'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} в браузере`);
});