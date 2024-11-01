const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'aulabd'
});

db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro);
    } else {
        console.log('Conectado ao MySQL com sucesso!');
    }
});

app.post('/alunos', (req, res) => {
    const { nome, cidade, estado } = req.body;

    const sql = 'INSERT INTO alunos (nome, cidade, estado) VALUES (?, ?, ?)';
    db.query(sql, [nome, cidade, estado], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao cadastrar aluno!'});
        }
        res.status(201).json({ message: 'Aluno caddastrado com sucesso!', id: result.insertId});
    });
});

app.get('/alunos', (req, res) => {
    const sql = 'SELECT * FROM alunos';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar alunos'});
        }
        res.json(results);
    });
});

app.get('/alunos/:codigo', (req, res) => {
    const { codigo } = req.params;

    const sql = 'SELECT * FROM alunos WHERE codigo = ?';
    db.query(sql, [codigo], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar alunos'});
        }

        if (results.lenght === 0 ) {
            console.error('Usuário não encontrado:', err);
            return res.status(404).json({ error: 'Usuário encontrado'});
        }

        res.json(results[0]);
    });
});

app.put('/alunos/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { nome, cidade, estado } = req.body;

    const sql = 'UPDATE alunos SET nome = ?, cidade = ?, estado = ? WHERE codigo = ?';

    db.query(sql, [nome, cidade, estado, codigo], (err) => {
        if (err) {
            console.error('Erro ao ayualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar usuário'});
        }
        res.json({ message: 'Aluno atualizado com sucesso!'});
    });
});

app.delete('/aluno/:codigo', (req, res) =>{
    const { codigo } = req.params;

    const sql = 'DELETE FROM alunos WHERE codigo = ?';

    db.query(sql, [codigo], (err) =>{
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir aluno'});
        }
        res.json({ message: 'Aluno excluído com sucesso!'});
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});