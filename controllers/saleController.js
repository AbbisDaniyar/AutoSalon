const connectController = require('./connectController.js');
const pool = connectController.pool;

exports.addToCart = async function(req, res) {
    try {
        const carId = req.params.id;
        
        const existingItem = connectController.cart.find(item => item.car_id == carId);
        if (existingItem) return res.redirect('/cars');
        
        const [cars] = await pool.execute(`
            SELECT c.*, m.model_name, b.brand_name 
            FROM cars c 
            JOIN models m ON c.model_id_ref = m.model_id 
            JOIN brands b ON m.brand_id_ref = b.brand_id 
            WHERE c.car_id = ?
        `, [carId]);
        
        if (cars.length > 0) {
            const car = cars[0];
            await pool.execute("UPDATE cars SET status = 'reserved' WHERE car_id = ?", [carId]);
            connectController.cart.push(car);
        }
        
        res.redirect('/cars');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении в корзину');
    }
};

exports.getCart = async function(req, res) {
    try {
        const totalPrice = connectController.cart.reduce((total, car) => total + parseFloat(car.price), 0);
        const [clients] = await pool.execute("SELECT * FROM clients");
        const [employees] = await pool.execute("SELECT * FROM employees");
        
        res.render('sales/cart', {
            title: 'Корзина - Автосалон',
            pageTitle: 'Корзина бронирования',
            cartCars: connectController.cart,
            totalPrice: totalPrice,
            Clients: clients,
            Employees: employees
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.cartToHistory = async function(req, res) {
    try {
        const { client_id_ref, employee_id_ref, payment_type } = req.body;
        
        if (!client_id_ref || !employee_id_ref) return res.status(400).send('Не выбраны клиент или сотрудник');
        
        for (const car of connectController.cart) {
            await pool.execute(
                "INSERT INTO sales (car_id_ref, client_id_ref, employee_id_ref, sale_price, payment_type, sale_date) VALUES (?, ?, ?, ?, ?, CURDATE())",
                [car.car_id, client_id_ref, employee_id_ref, car.price, payment_type]
            );
            await pool.execute("UPDATE cars SET status = 'sold' WHERE car_id = ?", [car.car_id]);
        }
        
        connectController.cart.length = 0;
        res.redirect('/cars');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при оформлении продажи');
    }
};

exports.getHistory = async function(req, res) {
    try {
        const clientId = req.params.id;
        
        const [history] = await pool.execute(`
            SELECT s.sale_id, s.sale_date, s.sale_price, s.payment_type,
                   c.vin, c.color,
                   b.brand_name, m.model_name,
                   cl.full_name as client_name,
                   e.full_name as employee_name
            FROM sales s
            JOIN cars c ON s.car_id_ref = c.car_id
            JOIN models m ON c.model_id_ref = m.model_id
            JOIN brands b ON m.brand_id_ref = b.brand_id
            JOIN clients cl ON s.client_id_ref = cl.client_id
            JOIN employees e ON s.employee_id_ref = e.employee_id
            WHERE s.client_id_ref = ?
            ORDER BY s.sale_date DESC
        `, [clientId]);
        
        res.render('sales/history', {
            title: 'История покупок - Автосалон',
            pageTitle: 'История покупок клиента',
            History: history
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};