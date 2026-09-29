import { services } from "./services";

const PRIMARY_PHONE_LABEL = "+54 9 3758 55-0237";
const PRIMARY_PHONE_HREF = "tel:+5493758550237";
const WHATSAPP_LABEL = "11 2779 2932";
const WHATSAPP_NUMBER = "5491127792932";

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Remodelaya, inicio">
      <svg className="brand__mark" viewBox="0 0 72 62" aria-hidden="true">
        <circle cx="27" cy="31" r="23" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M18 43V19h11.5c8 0 12.5 4 12.5 10 0 4-2 7-6 8.7L44 48" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 25 52 12l16 13" fill="none" stroke="#f47a20" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M43 23v23h18V23" fill="#f47a20" />
        <rect x="50" y="34" width="6" height="12" rx="1" fill="#08294d" />
      </svg>
      <span className="brand__copy">
        <strong>REMODELAYA</strong>
        <small>CONSTRUCCIÓN INTEGRAL Y REFACCIONES</small>
      </span>
    </a>
  );
}

function App() {
  return (
    <>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Brand />
          <nav className="nav" aria-label="Navegación principal">
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#contacto">Contacto</a>
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

      <main>
        <section className="hero" id="inicio">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <span className="eyebrow">CONSTRUCCIÓN Y REFACCIONES</span>
              <h1>Tu próxima obra, <span>en buenas manos.</span></h1>
              <p className="hero__lead">
                Renová, construí y transformá tu espacio. Soluciones integrales para tu hogar o industria,
                en CABA y Gran Buenos Aires.
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
                <a className="button button--outline" href="#servicios">
                  Explorá los servicios
                </a>
              </div>
              <p className="hero__note">Presupuestos sin cargo</p>
            </div>

            <div className="hero-card" aria-label="Remodelaya, espacios para vivir mejor">
              <div className="hero-card__roof" aria-hidden="true" />
              <div className="hero-card__content">
                <span>ESPACIOS PARA VIVIR MEJOR</span>
                <strong>Construcción integral con trato directo.</strong>
                <p>Coordinamos distintas especialidades para resolver la obra de principio a fin.</p>
              </div>
              <div className="hero-card__badges">
                <span>Trabajos garantizados</span>
                <span>Servicios integrales</span>
                <span>CABA y Gran Buenos Aires</span>
              </div>
            </div>
          </div>
        </section>

        <section className="services section" id="servicios">
          <div className="shell">
            <div className="section-heading">
              <span className="eyebrow">NUESTROS SERVICIOS</span>
              <h2>Una solución para <span>cada parte de tu obra.</span></h2>
              <p>Desde un arreglo puntual hasta una refacción completa. Conocé nuestras especialidades.</p>
            </div>

            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <span className="service-card__number">{service.id}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a
                    href={whatsappUrl(
                      `Hola, quiero consultar por ${service.title.toLocaleLowerCase("es-AR")}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              ))}
            </div>

            <div className="multi-service">
              <p>¿Tu proyecto combina varios servicios? <strong>Lo vemos juntos.</strong></p>
              <a
                href={whatsappUrl("Hola, quiero consultar por una obra que combina varios servicios.")}
                target="_blank"
                rel="noreferrer"
              >
                Consultanos
              </a>
            </div>
          </div>
        </section>

        <section className="about section" id="nosotros">
          <div className="shell about__grid">
            <div>
              <span className="eyebrow eyebrow--light">SOMOS REMODELAYA</span>
              <h2>Construcción integral. <span>Trato directo.</span></h2>
            </div>
            <div className="about__content">
              <p>
                Una refacción empieza con una idea y una buena conversación. Contanos qué necesitás hacer:
                reunimos distintas especialidades para abordar tu obra de manera integral.
              </p>
              <div className="director">
                <span className="director__avatar">DD</span>
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
              <span className="eyebrow">EMPECEMOS POR TU IDEA</span>
              <h2>¿Qué querés <span>transformar?</span></h2>
              <p>Contanos qué trabajo necesitás y en qué zona estás. Pedí tu presupuesto sin cargo.</p>
              <a
                className="button button--orange"
                href={whatsappUrl("Hola, quiero pedir un presupuesto. Mi obra es en: ")}
                target="_blank"
                rel="noreferrer"
              >
                Escribinos por WhatsApp
              </a>
            </div>

            <aside className="contact-card">
              <span className="contact-card__label">TU CONTACTO DE OBRA</span>
              <h3>Daniel Díaz</h3>
              <p>Director de obra</p>

              <a className="contact-row" href={PRIMARY_PHONE_HREF}>
                <span>
                  <small>Teléfono principal</small>
                  <strong>{PRIMARY_PHONE_LABEL}</strong>
                </span>
                <b>Llamar</b>
              </a>

              <a
                className="contact-row"
                href={whatsappUrl("Hola, quiero hacer una consulta a Remodelaya.")}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <small>WhatsApp</small>
                  <strong>{WHATSAPP_LABEL}</strong>
                </span>
                <b>WhatsApp</b>
              </a>

              <div className="contact-card__zone">CABA y Gran Buenos Aires</div>
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
          <a href="#inicio">Volver arriba ↑</a>
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
