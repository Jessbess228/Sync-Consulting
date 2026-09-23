import nodemailer from 'nodemailer'

const SMTP_PROVIDERS = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
  },
}

export function bookingMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

function mailingDefaults() {
  const provider = (process.env.SMTP_PROVIDER || 'gmail').toLowerCase()
  const defaults = SMTP_PROVIDERS[provider] || SMTP_PROVIDERS.gmail

  return {
    host: process.env.SMTP_HOST || defaults.host,
    port: Number(process.env.SMTP_PORT || defaults.port),
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === 'true'
      : defaults.secure,
  }
}

function bookingBody({ name, email, phone, message, txt, call }) {
  return [
    `Name: ${name}`,
    `Email: ${email || '—'}`,
    `Phone: ${phone || '—'}`,
    `Txt: ${txt ? 'yes' : 'no'}`,
    `Call: ${call ? 'yes' : 'no'}`,
    '',
    'Message:',
    message || '—',
  ].join('\n')
}

export async function sendBookingEmail(booking) {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are not set')
  }

  const { host, port, secure } = mailingDefaults()

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"Sync Consulting" <${user}>`,
    to: process.env.BOOKING_TO || 'jessicaberrydev@gmail.com',
    replyTo: booking.email || undefined,
    subject: `Sync - Booking from ${booking.name}`,
    text: bookingBody(booking),
  })
}
