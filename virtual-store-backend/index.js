const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configuração do banco de dados

const db = mysql.createConnection({
    host: 'localhost',
    user: 'libertet_virtualstore',
    password: 'FcL0WAQlULfF',
    database: 'libertet_virtualstore',
    decimalNumbers: true,
});

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'virtual_store',
//     decimalNumbers: true,
// });

// Conexão com o banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoints

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products WHERE units > 0';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// Rota para verificar login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Consulta ao banco de dados para verificar o usuário
    const query = 'SELECT id, name, email FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            // Usuário encontrado
            const user = results[0];
            res.json(user);
        } else {
            // Usuário não encontrado
            res.status(401).json({ message: 'Email ou senha incorretos' });
        }
    });
});


// Rota para registrar uma compra e atualizar o estoque
app.post('/api/purchase', (req, res) => {
    const { userId, productId, units } = req.body;

    const checkStockQuery = 'SELECT units FROM products WHERE id = ?';
    db.query(checkStockQuery, [productId], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const availableUnits = results[0].units;
        if (availableUnits < units) {
            res.status(400).json({ message: 'Estoque insuficiente' });
            return;
        }

        const insertPurchaseQuery = 'INSERT INTO purchases (user_id, product_id, units) VALUES (?, ?, ?)';
        const updateStockQuery = 'UPDATE products SET units = units - ? WHERE id = ?';

        db.query(insertPurchaseQuery, [userId, productId, units], (err) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            db.query(updateStockQuery, [units, productId], (err) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }

                res.json({ message: 'Compra realizada com sucesso!' });
            });
        });
    });
});

// Rota para listar as compras de um usuário
app.get('/api/purchases/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT p.name, p.price, pu.units, pu.units * p.price AS total 
        FROM purchases pu 
        INNER JOIN products p ON pu.product_id = p.id 
        WHERE pu.user_id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
