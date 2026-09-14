import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

type Booking = {
  name: string
  email: string
  phone: string
  message: string
  txt: boolean
  call: boolean
}

const BOOKING_SENT_KEY = 'sc-booking-sent'
let bookingInFlight: Promise<void> | null = null
let sentThisSession = false

function hasSentBooking() {
  if (sentThisSession) return true
  try {
    return sessionStorage.getItem(BOOKING_SENT_KEY) === '1'
  } catch {
    return false
  }
}

function markBookingSent() {
  sentThisSession = true
  try {
    sessionStorage.setItem(BOOKING_SENT_KEY, '1')
  } catch {
    // Private mode can block sessionStorage; in-memory lock still applies.
  }
}

async function submitBooking(booking: Booking) {
  if (hasSentBooking()) return
  if (bookingInFlight) return bookingInFlight

  bookingInFlight = (async () => {
    const response = await fetch('/cms-api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    })
    if (!response.ok) {
      throw new Error('Could not send booking')
    }
    markBookingSent()
  })()

  try {
    await bookingInFlight
  } finally {
    bookingInFlight = null
  }
}

function BookingDialog({
  onClose,
  formTitle,
}: {
  onClose: () => void
  formTitle: string
}) {
  const headingId = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(() =>
    hasSentBooking() ? 'sent' : 'idle',
  )
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    nameRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (status !== 'sent') return
    const timer = window.setTimeout(onClose, 2000)
    return () => window.clearTimeout(timer)
  }, [status, onClose])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (String(data.get('company') || '')) return

    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    if (!email && !phone) {
      setContactError('Add an email or a phone number')
      return
    }

    if (hasSentBooking()) {
      setStatus('sent')
      return
    }

    setContactError('')
    setStatus('sending')
    try {
      await submitBooking({
        name: String(data.get('name') || '').trim(),
        email,
        phone,
        message: String(data.get('message') || '').trim(),
        txt: data.get('txt') === 'on',
        call: data.get('call') === 'on',
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="sc-booking" role="presentation" onClick={onClose}>
      <div
        className="sc-booking__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="sc-booking__close" type="button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 3l10 10M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id={headingId} className="sc-booking__title">
          {formTitle || 'Book a visit'}
        </h2>
        {status === 'sent' ? (
          <p className="sc-booking__thanks">Received. We’ll be in touch within a week.</p>
        ) : (
          <form className="sc-booking__form" onSubmit={(event) => void handleSubmit(event)}>
            <label className="sc-booking__field">
              Name
              <input ref={nameRef} name="name" type="text" autoComplete="name" required />
            </label>
            <label className="sc-booking__field">
              Email
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label className="sc-booking__field">
              Phone
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <div className="sc-booking__checks">
              <label className="sc-booking__check">
                <input name="txt" type="checkbox" />
                Txt
              </label>
              <label className="sc-booking__check">
                <input name="call" type="checkbox" />
                Call
              </label>
            </div>
            <label className="sc-booking__field">
              Message
              <textarea name="message" rows={3} />
            </label>
            <input className="sc-booking__honeypot" name="company" tabIndex={-1} autoComplete="off" />
            {contactError ? <p className="sc-booking__error">{contactError}</p> : null}
            {status === 'error' ? <p className="sc-booking__error">Couldn’t send. Try again.</p> : null}
            <button className="sc-btn sc-btn--primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Book'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function BookingButton({
  label,
  variant,
  formTitle,
  editing = false,
}: {
  label: string
  variant: 'primary' | 'ghost'
  formTitle?: string
  editing?: boolean
}) {
  const [open, setOpen] = useState(false)
  const title = formTitle || 'Book a visit'
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        className={`sc-btn sc-btn--${variant === 'ghost' ? 'ghost' : 'primary'}`}
        onClick={() => {
          if (!editing) setOpen(true)
        }}
      >
        {label}
      </button>
      {open ? createPortal(<BookingDialog onClose={close} formTitle={title} />, document.body) : null}
    </>
  )
}
