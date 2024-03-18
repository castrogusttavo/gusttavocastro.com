import { Resend } from 'resend';
import EmailTemplate from '../../components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(req, res) {
  try {
    const { name, email, message } = req.body; // Desestruturação dos campos específicos

    await resend.sendEmail({
      from: 'castrogusttavo.dev@gmail.com <castrogusttavo.dev@gmail.com>',
      to: 'castrogusttavo.dev@gmail.com',
      replyTo: email, // Usando o email diretamente do req.body
      subject: `${name} - via gusttavocastro.com`, // Usando o nome diretamente do req.body
      html: EmailTemplate({ name, email, message }), // Passando os campos específicos para EmailTemplate
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
