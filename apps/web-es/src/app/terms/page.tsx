import { Metadata } from 'next';

// TODO(legal): working Spanish translation of the English terms of use, not yet
// reviewed by counsel. The English version at apps/web remains authoritative.
export const metadata: Metadata = {
  title: 'Términos de Uso | Calculadora de Casos con IA',
  description: 'Términos de uso del servicio Calculadora de Casos con IA.',
};

export default function TermsOfUse() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Términos de Uso</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
          Última actualización: 12 de mayo de 2026
        </p>

        <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>1. Aceptación de los Términos</h2>
            <p>
              Al acceder o utilizar la Calculadora de Casos con IA (el &quot;Servicio&quot;), usted acepta
              quedar sujeto a estos Términos de Uso. Si no está de acuerdo con estos términos, no
              utilice el Servicio.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>2. Descripción del Servicio</h2>
            <p>
              La Calculadora de Casos con IA proporciona <strong>estimados ilustrativos</strong> del
              valor potencial de reclamos por lesiones personales con fines educativos. El Servicio
              utiliza datos disponibles públicamente y marcos de estimación estándar para generar
              rangos.
            </p>
          </section>

          <section style={{ marginBottom: '32px', background: '#fef3c7', padding: '20px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px', color: '#92400e' }}>
              3. AVISOS IMPORTANTES
            </h2>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#92400e' }}>
              3.1 No Es Asesoría Legal
            </h3>
            <p>
              <strong>EL SERVICIO NO PROPORCIONA ASESORÍA LEGAL.</strong> Los estimados que ofrece
              son únicamente informativos y educativos. No constituyen asesoría legal y el uso de
              este Servicio no crea una relación abogado-cliente.
            </p>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#92400e' }}>
              3.2 Sin Garantía de Resultados
            </h3>
            <p>
              <strong>LOS ESTIMADOS SON SOLO ILUSTRATIVOS Y NO PREDICEN RESULTADOS REALES.</strong>
              {' '}El valor real de un caso varía considerablemente según los hechos específicos, la
              evidencia, la jurisdicción, la cobertura del seguro y muchos otros factores. Los
              resultados anteriores no garantizan resultados futuros.
            </p>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px', color: '#92400e' }}>
              3.3 Consulte a un Abogado
            </h3>
            <p>
              Debe consultar con un abogado calificado para recibir asesoría específica sobre su
              situación antes de tomar cualquier decisión sobre sus derechos legales o posibles
              reclamos.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>4. Divulgación de la Metodología</h2>
            <p>
              Los estimados generados por este Servicio se basan en:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                Datos de la industria disponibles públicamente, de fuentes como el Insurance
                Information Institute, la FMCSA y recursos de información legal
              </li>
              <li>
                Marcos de estimación estándar, como el método del multiplicador para el dolor y
                sufrimiento
              </li>
              <li>
                Supuestos divulgados explícitamente (como tarifas ilustrativas de honorarios de
                abogados)
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Cada estimado incluye las citas completas de sus fuentes. Visite nuestra página de{' '}
              <a href="/sources" style={{ color: 'var(--primary)' }}>Fuentes de Datos</a> para ver
              todos los detalles de la metodología.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>5. Responsabilidades del Usuario</h2>
            <p>Usted acepta:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Proporcionar información precisa y veraz al usar el Servicio</li>
              <li>Usar el Servicio únicamente con fines legales</li>
              <li>No intentar manipular ni abusar del Servicio</li>
              <li>No usar medios automatizados para acceder al Servicio sin autorización</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>6. Consentimiento de Comunicaciones</h2>
            <p>
              Al enviar su información de contacto a través del Servicio, usted da su consentimiento
              expreso para:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                Recibir llamadas telefónicas y mensajes de texto, incluso mediante tecnología
                automatizada, de nuestra parte y de nuestros socios con fines de mercadeo
              </li>
              <li>
                Recibir comunicaciones en cualquier momento, incluso antes de las 8:00 a.m. o
                después de las 9:00 p.m., hora local
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              El consentimiento no es una condición de compra ni para recibir servicios. Pueden
              aplicarse tarifas estándar de mensajes y datos. Puede retirar su consentimiento en
              cualquier momento.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>7. Propiedad Intelectual</h2>
            <p>
              El Servicio, incluidos su diseño, texto, gráficos y código, es de nuestra propiedad y
              está protegido por leyes de derechos de autor y otras leyes de propiedad intelectual.
              No puede copiar, modificar, distribuir ni crear obras derivadas sin nuestro permiso
              por escrito.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>8. Limitación de Responsabilidad</h2>
            <p>
              EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY, NO SEREMOS RESPONSABLES POR NINGÚN DAÑO
              INDIRECTO, INCIDENTAL, ESPECIAL, CONSECUENTE O PUNITIVO QUE SURJA DE SU USO DEL
              SERVICIO.
            </p>
            <p style={{ marginTop: '12px' }}>
              NO GARANTIZAMOS QUE EL SERVICIO SEA ININTERRUMPIDO, LIBRE DE ERRORES O COMPLETAMENTE
              SEGURO. EL SERVICIO SE PROPORCIONA &quot;TAL CUAL&quot;, SIN GARANTÍAS DE NINGÚN TIPO.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>9. Indemnización</h2>
            <p>
              Usted acepta indemnizarnos y eximirnos de responsabilidad por cualquier reclamo, daño
              o gasto que surja de su uso del Servicio o del incumplimiento de estos Términos.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los
              cambios entrarán en vigor al publicarse en esta página. Su uso continuo del Servicio
              constituye la aceptación de los Términos modificados.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>11. Ley Aplicable</h2>
            <p>
              Estos Términos se regirán e interpretarán conforme a las leyes del Estado de [Your
              State], sin tener en cuenta sus principios sobre conflicto de leyes.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>12. Información de Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos, comuníquese con nosotros:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px', listStyle: 'none' }}>
              <li>Correo electrónico: legal@[your-domain].com</li>
              <li>Teléfono: (833) 312-4023</li>
            </ul>
          </section>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            ← Volver a la Calculadora
          </a>
        </div>
      </div>
    </div>
  );
}
