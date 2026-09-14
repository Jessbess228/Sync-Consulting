import nodemailer from 'nodemailer'

export function bookingMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
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
