import type { NextApiRequest, NextApiResponse } from 'next'
import { SMTPClient } from 'emailjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body

    // Verificar que las variables de entorno necesarias estén definidas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_HOST || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
      console.error('Missing environment variables')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const client = new SMTPClient({
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      host: process.env.SMTP_HOST,
      ssl: true,
    })

    try {
      await client.sendAsync({
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
        from: process.env.FROM_EMAIL,
        to: process.env.TO_EMAIL,
        subject: 'Nuevo mensaje de contacto - IPA Las Encinas',
      })

      res.status(200).json({ message: 'Email sent successfully' })
    } catch (error) {
      console.error('Error sending email:', error)
      res.status(500).json({ message: 'Error sending email' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}