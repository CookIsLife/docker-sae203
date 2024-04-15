const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:', err => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)", err => {
        if (err) {
            console.error("Failed to create table", err);
            return;
        }
        console.log("Table created or already exists");
    });
});


// 注册用户
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT username FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).send('Database error');
            return;
        }
        if (row) {
            res.status(400).send('User already exists.');
            return;
        }
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
            if (err) {
                console.error('Error registering new user:', err.message);
                res.status(500).send('Error registering new user.');
                return;
            }
            res.send('User registered successfully.');
        });
    });
});

// 用户登录
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT password FROM users WHERE username = ?", [username], (err, row) => {
        if (!row) {
            res.status(401).send('Invalid credentials.');
            return;
        }
        if (row.password === password) {
            res.send('Login successful.');
        } else {
            res.status(401).send('Invalid credentials.');
        }
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast to all users
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});