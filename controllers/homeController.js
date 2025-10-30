exports.index = function(req, res) {
    res.render('home/index', {
        title: 'Автосалон - Главная',
        pageTitle: 'Добро пожаловать в Автосалон'
    });
};

exports.about = function(req, res) {
    res.render('home/about', {
        title: 'О нас - Автосалон',
        pageTitle: 'О нашем салоне'
    });
};