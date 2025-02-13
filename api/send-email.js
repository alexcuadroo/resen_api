import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        try {
            // Enviar el correo electrónico a tu dirección
            const data = await resend.emails.send({
                from: 'no-reply@edualex.uy', // Dirección de envío (debe estar verificada en Resend)
                to: 'help@edualex.uy', // Tu dirección de correo electrónico
                subject: `Nuevo mensaje de ${name}`, // Asunto del correo
                html: `
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo electrónico:</strong> ${email}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `, // Cuerpo del correo en HTML
            });

            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido' });
    }
}