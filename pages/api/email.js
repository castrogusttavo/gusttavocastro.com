import { Resend } from 'resend';
import EmailTemplate from '../../components/EmailTemplate';

const resend = new Resend('re_P3YeHLCz_Q9agbUAnLLN3JkDQzBYRtNQB');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  try {
    await resend.sendEmail({
      from: 'Gusttavo <onboarding@resend.dev>',
      to: 'castrogusttavo.dev@gmail.com',
      replyTo: email,
      subject: `${name} - via gusttavocastro-com.vercel.app`,
      html: EmailTemplate({ name, email, message }),
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
}