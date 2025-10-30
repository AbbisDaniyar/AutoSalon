const connectController = require('./connectController.js');
const pool = connectController.pool;

exports.getCars = async function(req, res) {
    try {
        let baseQuery = `
            SELECT c.car_id, c.vin, c.color, c.engine, c.transmission, c.price, c.status,
                   m.model_name, m.car_type,
                   b.brand_name
            FROM cars c
            JOIN models m ON c.model_id_ref = m.model_id
            JOIN brands b ON m.brand_id_ref = b.brand_id
        `;
        
        let filters = [];
        let params = [];
        
        const { brandId, carType, engine, transmission, minPrice, maxPrice } = req.query;
        
        if (brandId && brandId !== '0') {
            filters.push("b.brand_id = ?");
            params.push(brandId);
        }
        
        if (carType && carType !== 'all') {
            filters.push("m.car_type = ?");
            params.push(carType);
        }
        
        if (engine && engine !== 'all') {
            filters.push("c.engine = ?");
            params.push(engine);
        }
        
        if (transmission && transmission !== 'all') {
            filters.push("c.transmission = ?");
            params.push(transmission);
        }
        
        if (minPrice) {
            filters.push("c.price >= ?");
            params.push(minPrice);
        }
        
        if (maxPrice) {
            filters.push("c.price <= ?");
            params.push(maxPrice);
        }
        
        if (filters.length > 0) {
            baseQuery += " WHERE " + filters.join(" AND ");
        }
        
        baseQuery += " ORDER BY c.car_id DESC";
        
        const [brands] = await pool.execute("SELECT * FROM brands");
        const [cars] = await pool.execute(baseQuery, params);
        
        const cartLen = connectController.cart.length;
        
        res.render('cars/cars', {
            title: 'Автомобили - Автосалон',
            pageTitle: 'Каталог автомобилей',
            Cars: cars,
            Brands: brands,
            curBrandId: brandId || '0',
            curCarType: carType || 'all',
            curEngine: engine || 'all',
            curTransmission: transmission || 'all',
            cartLen: cartLen
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.addCar = async function(req, res) {
    try {
        const [models] = await pool.execute(`
            SELECT m.model_id, m.model_name, b.brand_name 
            FROM models m 
            JOIN brands b ON m.brand_id_ref = b.brand_id
        `);
        
        res.render('cars/addCar', {
            title: 'Добавить автомобиль - Автосалон',
            pageTitle: 'Добавление автомобиля',
            Models: models
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.postAddCar = async function(req, res) {
    try {
        if (!req.body) return res.sendStatus(400);
        
        const { model_id_ref, vin, color, engine, transmission, price, status } = req.body;
        
        const query = `INSERT INTO cars (model_id_ref, vin, color, engine, transmission, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        await pool.execute(query, [model_id_ref, vin, color, engine, transmission, price, status]);
        res.redirect('/cars');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении автомобиля');
    }
};

exports.editCar = async function(req, res) {
    try {
        const carId = req.params.id;
        const [cars] = await pool.execute("SELECT * FROM cars WHERE car_id = ?", [carId]);
        const [models] = await pool.execute(`
            SELECT m.model_id, m.model_name, b.brand_name 
            FROM models m 
            JOIN brands b ON m.brand_id_ref = b.brand_id
        `);
        
        if (cars.length === 0) return res.status(404).send('Автомобиль не найден');
        
        res.render('cars/editCar', {
            title: 'Редактировать автомобиль - Автосалон',
            pageTitle: 'Редактирование автомобиля',
            car: cars[0],
            Models: models
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.postEditCar = async function(req, res) {
    try {
        if (!req.body) return res.sendStatus(400);
        
        const { car_id, model_id_ref, color, engine, transmission, price, status } = req.body;
        
        const query = `UPDATE cars SET model_id_ref=?, color=?, engine=?, transmission=?, price=?, status=? WHERE car_id=?`;
        
        await pool.execute(query, [model_id_ref, color, engine, transmission, price, status, car_id]);
        res.redirect('/cars');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении автомобиля');
    }
};

exports.deleteCar = async function(req, res) {
    try {
        const carId = req.params.id;
        await pool.execute("DELETE FROM cars WHERE car_id = ?", [carId]);
        res.redirect('/cars');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при удалении автомобиля');
    }
};