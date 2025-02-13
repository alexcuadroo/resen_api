const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:4321/, https://edualex.uy/',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});
// Tu ruta de la API
app.post('/api/send-email', (req, res) => {
    // Lógica para manejar la solicitud
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});