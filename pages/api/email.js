import { Resend } from 'resend';
import EmailTemplate from '../../components/EmailTemplate';

const resend = new Resend('re_123456789');

export default async function sendEmail(req, res) {
  try {
    const { name, email, message } = req.body;

    await resend.sendEmail({
      from: 'Gusttavo <onboarding@resend.dev>',
      to: 'castrogusttavo.dev@gmail.com',
      replyTo: email,
      subject: `${name} - via gusttavocastro.com`,
      html: EmailTemplate({ name, email, message }),
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (e) {
    res.status(200).json({ message: 'Email sent' });
  }
}