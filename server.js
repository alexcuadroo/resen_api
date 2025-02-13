// Importar dependencias
import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// Crear una instancia de Express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Ruta para manejar el envío de correos electrónicos
app.post('/api/send-email', async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { nombre, correo, mensaje } = req.body;

        // Validar que los datos estén presentes
        if (!nombre || !correo || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: nombre, correo, mensaje',
            });
        }

        // Enviar el correo electrónico usando Resend
        const data = await resend.emails.send({
            from: 'no-reply@edualex.uy', // Cambia esto a tu dominio verificado en Resend
            to: 'help@edualex.uy', // Cambia esto al correo donde quieres recibir los mensajes
            subject: `Nuevo mensaje de ${nombre}`, // Asunto del correo
            html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo electrónico:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong> ${mensaje}</p>
      `, // Cuerpo del correo en HTML
        });

        // Responder con éxito
        res.status(200).json({
            success: true,
            message: 'Correo enviado con éxito',
            data,
        });
    } catch (error) {
        // Manejar errores
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo',
            error: error.message,
        });
    }
});
app.get('/', (req, res) => { res.send('Hello World!'); });
// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});