import { useState } from "react";
import { services } from "./services";

const SITE_ASSET_BASE = "https://remodelaya.jereprograma.chatgpt.site/assets";
const BRAND_MARK = "/assets/brand-mark.png";
const HERO_IMAGE = "/assets/interior-hero.webp";
const BRAND_MARK_FALLBACK = `${SITE_ASSET_BASE}/brand-mark.png`;
const HERO_IMAGE_FALLBACK = `${SITE_ASSET_BASE}/interior-hero.webp`;

const WHATSAPP_LABEL = "11 2779 2932";
const WHATSAPP_NUMBER = "5491127792932";
const PRIMARY_PHONE_LABEL = "+54 9 3758 55-0237";
const PRIMARY_PHONE_HREF = "tel:+5493758550237";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Remodelaya, inicio">
      <img
        className="brand__mark"
        src={BRAND_MARK}
        alt=""
        width="58"
        height="58"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = BRAND_MARK_FALLBACK;
        }}
      />
      <span className="brand__copy">
        <strong>REMODELAYA</strong>
        <small>CONSTRUCCIÓN INTEGRAL Y REFACCIONES</small>
      </span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="button__icon">
      <path
        fill="currentColor"
        d="M12 2a9.6 9.6 0 0 0-8.2 14.6L2.5 21.5l5-1.3A9.8 9.8 0 1 0 12 2Zm0 17.7a7.8 7.8 0 0 1-4-1.1l-.3-.2-3 .8.8-2.9-.2-.3a7.7 7.7 0 1 1 6.7 3.7Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.3.2-.3.7-1 .1-.2.1-.4 0-.6l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.5s1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.4-.6 1.6-1.1.2-.6.2-1 .2-1.1-.1-.2-.3-.3-.5-.4Z"
      />
    </svg>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>

      <header className="site-header">
        <div className="shell site-header__inner">
          <Brand />

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav ${menuOpen ? "nav--open" : ""}`} aria-label="Navegación principal">
            <a href="#inicio" onClick={closeMenu}>Inicio</a>
            <a href="#servicios" onClick={closeMenu}>Servicios</a>
            <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
            <a href="#contacto" onClick={closeMenu}>Contacto</a>
          </nav>

          <a
            className="button button--orange header-cta"
            href={whatsappUrl("Hola, quiero pedir un presupuesto para una obra.")}
            target="_blank"
            rel="noreferrer"
          >
            Pedir presupuesto
          </a>
        </div>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--hero">CONSTRUCCIÓN Y REFACCIONES</p>
              <h1>
                Tu próxima obra,
                <br />
                en buenas
                <br />
                <em>manos.</em>
              </h1>

              <p className="hero__lead">
                Renová, construí y transformá tu espacio.
                <br className="desktop-break" />
                Soluciones integrales para tu hogar o industria, en CABA y Gran Buenos Aires.
              </p>

              <div className="hero__actions">
                <a
                  className="button button--orange"
                  href={whatsappUrl("Hola, quiero pedir un presupuesto para una obra.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  Pedí tu presupuesto
                </a>
                <a className="button button--ghost" href="#servicios">
                  Explorá los servicios
                </a>
              </div>

              <p className="hero__note">
                <span aria-hidden="true">✓</span>
                Presupuestos sin cargo
              </p>
            </div>

            <div className="hero__visual">
              <figure className="hero-figure">
                <img
                  src={HERO_IMAGE}
                  alt="Interior luminoso de una casa renovada"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = HERO_IMAGE_FALLBACK;
                  }}
                />
                <div className="hero-figure__shade" />
                <div className="hero-figure__caption">
                  <strong>ESPACIOS PARA VIVIR MEJOR</strong>
                  <span>Imagen ilustrativa</span>
                </div>
              </figure>

              <div className="hero__badges" aria-label="Beneficios">
                <span>Trabajos garantizados</span>
                <span>Servicios integrales</span>
                <span>CABA y Gran Buenos Aires</span>
              </div>
            </div>
          </div>

          <a className="hero__project-link" href="#contacto">
            Hablemos de tu proyecto <span aria-hidden="true">↘</span>
          </a>
        </section>

        <section className="services section" id="servicios">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">NUESTROS SERVICIOS</p>
              <h2>
                Una solución para
                <br />
                cada parte de tu obra.
              </h2>
              <p className="section-heading__lead">
                Desde un arreglo puntual hasta una refacción completa. Conocé nuestras especialidades.
              </p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <span className="service-card__number">{service.id}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a
                    href={whatsappUrl(
                      `Hola, quisiera pedir un presupuesto para: ${service.title}. Mi zona es: `,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>

            <div className="multi-service">
              <p>
                ¿Tu proyecto combina varios servicios? <strong>Lo vemos juntos.</strong>
              </p>
              <a href="#contacto">
                Consultanos <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="about section" id="nosotros">
          <div className="shell about__grid">
            <div className="about__heading">
              <p className="eyebrow">SOMOS REMODELAYA</p>
              <h2>
                Construcción integral.
                <br />
                Trato directo.
              </h2>
            </div>

            <div className="about__content">
              <p>
                Una refacción empieza con una idea y una buena conversación. Contanos qué necesitás hacer:
                reunimos distintas especialidades para abordar tu obra de manera integral.
              </p>

              <div className="director">
                <span className="director__avatar" aria-hidden="true">DD</span>
                <span>
                  <strong>Daniel Díaz</strong>
                  <small>Director de obra</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact section" id="contacto">
          <div className="shell contact__grid">
            <div className="contact__copy">
              <p className="eyebrow">EMPECEMOS POR TU IDEA</p>
              <h2>
                ¿Qué querés
                <br />
                <em>transformar?</em>
              </h2>
              <p>
                Contanos qué trabajo necesitás y en qué zona estás.
                <br />
                Pedí tu presupuesto sin cargo.
              </p>

              <a
                className="button button--whatsapp"
                href={whatsappUrl("Hola, quiero pedir un presupuesto. El trabajo que necesito es: ")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                Escribinos por WhatsApp
              </a>
            </div>

            <aside className="contact-card">
              <p className="contact-card__label">TU CONTACTO DE OBRA</p>
              <h3>Daniel Díaz</h3>
              <p className="contact-card__role">Director de obra</p>

              <a className="contact-row" href={PRIMARY_PHONE_HREF}>
                <span>
                  <small>Contacto principal</small>
                  <strong>{PRIMARY_PHONE_LABEL}</strong>
                </span>
                <b>Llamar</b>
              </a>

              <a
                className="contact-row"
                href={whatsappUrl("Hola, quisiera consultar por un presupuesto de Remodelaya.")}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <small>WhatsApp alternativo</small>
                  <strong>{WHATSAPP_LABEL}</strong>
                </span>
                <b>WhatsApp</b>
              </a>

              <p className="contact-card__zone">
                <span aria-hidden="true">⌖</span>
                CABA y Gran Buenos Aires
              </p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer__inner">
          <div>
            <Brand />
            <p>Tu espacio, nuestro compromiso.</p>
          </div>

          <a className="footer__top" href="#inicio">
            Volver arriba <span aria-hidden="true">↑</span>
          </a>
        </div>

        <div className="shell footer__bottom">
          <span>© 2026 Remodelaya. Todos los derechos reservados.</span>
          <span>Construcción integral y refacciones en general.</span>
        </div>
      </footer>
    </>
  );
}

export default App;
