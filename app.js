const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const exphbs = require('express-handlebars');

// создаём экземпляр движка с помощью express-handlebars
const hbsEngine = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: {
        eq: (a, b) => a === b
    }
});

app.engine('hbs', hbsEngine.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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