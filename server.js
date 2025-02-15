import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:4321', 'https://edualex.uy', 'https://www.edualex.uy', 'https://edualex.uy/'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['POST'],
}));

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

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

        const data = await resend.emails.send({
            from: 'web@edualex.uy',
            to: 'help@edualex.uy',
            subject: `Nuevo mensaje de ${nombre} desde EduAlex`,
            html: `<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4; font-weight: bold;">Nombre:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4; font-weight: bold;">Correo electrónico:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${correo}</td>
  </tr>
  <tr>
    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4; font-weight: bold;">Mensaje:</td>
    <td style="padding: 8px; border: 1px solid #ddd;">${mensaje}</td>
  </tr>
</table>
`,
            text: `Nombre: ${nombre}
Correo electrónico: ${correo}
Mensaje: ${mensaje}`
        });
        res.status(200).json({
            success: true,
            message: 'Correo enviado con éxito',
            data,
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo',
            error: error.message,
        });
    }
});
app.get('/', (req, res) => { res.send('Hello World!'); });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
export default app;