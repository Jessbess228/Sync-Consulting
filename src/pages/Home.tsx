import { messages } from './Home.messages'

export function Home() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-brand">{messages.siteBrand}</div>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">{messages.navInfo}</a>
          <a href="#contact">{messages.navContact}</a>
          <a href="#admin">{messages.navAdmin}</a>
        </nav>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            {messages.heroLineOne}
          </h1>

          <p>{messages.heroBody}</p>

          <button type="button" className="primary-cta">
            {messages.ctaLabel}
          </button>
        </div>

        <div className="hero-visual" aria-label={messages.heroVisualLabel}>
          <div className="hero-image" />
        </div>
      </section>
    </main>
  )
}
