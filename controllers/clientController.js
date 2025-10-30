const connectController = require('./connectController.js');
const pool = connectController.pool;

exports.getClients = async function(req, res) {
    try {
        const [clients] = await pool.execute("SELECT * FROM clients ORDER BY client_id DESC");
        
        res.render('clients/clients', {
            title: 'Клиенты - Автосалон',
            pageTitle: 'Список клиентов',
            Clients: clients
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.addClient = function(req, res) {
    res.render('clients/addClient', {
        title: 'Добавить клиента - Автосалон',
        pageTitle: 'Добавление клиента'
    });
};

exports.postAddClient = async function(req, res) {
    try {
        if (!req.body) return res.sendStatus(400);
        
        const { full_name, phone, email } = req.body;
        
        const query = `INSERT INTO clients (full_name, phone, email) VALUES (?, ?, ?)`;
        
        await pool.execute(query, [full_name, phone, email]);
        res.redirect('/clients');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении клиента');
    }
};

exports.editClient = async function(req, res) {
    try {
        const clientId = req.params.id;
        const [clients] = await pool.execute("SELECT * FROM clients WHERE client_id = ?", [clientId]);
        
        if (clients.length === 0) return res.status(404).send('Клиент не найден');
        
        res.render('clients/editClient', {
            title: 'Редактировать клиента - Автосалон',
            pageTitle: 'Редактирование клиента',
            client: clients[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
};

exports.postEditClient = async function(req, res) {
    try {
        if (!req.body) return res.sendStatus(400);
        
        const { client_id, full_name, phone, email } = req.body;
        
        const query = `UPDATE clients SET full_name=?, phone=?, email=? WHERE client_id=?`;
        
        await pool.execute(query, [full_name, phone, email, client_id]);
        res.redirect('/clients');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении клиента');
    }
};