import { Metadata } from 'next';

// TODO(legal): working Spanish translation of the English privacy policy, not yet
// reviewed by counsel. The English version at apps/web remains authoritative.
export const metadata: Metadata = {
  title: 'Política de Privacidad | Calculadora de Casos con IA',
  description: 'Política de privacidad del servicio Calculadora de Casos con IA.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Política de Privacidad</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
          Última actualización: 12 de mayo de 2026
        </p>

        <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>1. Introducción</h2>
            <p>
              Esta Política de Privacidad describe cómo recopilamos, usamos y compartimos
              información cuando usted utiliza nuestro servicio de Calculadora de Casos con IA
              (el &quot;Servicio&quot;). Al usar el Servicio, usted acepta la recopilación y el uso de
              información conforme a esta política.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>2. Información Que Recopilamos</h2>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px' }}>
              2.1 Información Que Usted Proporciona
            </h3>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Información de contacto (nombre, correo electrónico, número de teléfono)</li>
              <li>Información de ubicación (código postal)</li>
              <li>Detalles del accidente (tipo, fecha, responsabilidad, lesiones)</li>
              <li>Descripción de su accidente (si la proporciona)</li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px' }}>
              2.2 Información Recopilada Automáticamente
            </h3>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Información del dispositivo y del navegador</li>
              <li>Dirección IP</li>
              <li>Datos de uso y analíticas</li>
              <li>Fuente de referencia y atribución de mercadeo (parámetros UTM)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>3. Cómo Usamos su Información</h2>
            <p>Usamos la información que recopilamos para:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Proporcionar y operar el Servicio de estimación de casos</li>
              <li>Conectarlo con recursos y representantes legales</li>
              <li>Comunicarnos con usted sobre su consulta por teléfono, correo electrónico o mensaje de texto</li>
              <li>Mejorar y optimizar nuestro Servicio</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>4. Divulgación de Información</h2>
            <p>Podemos compartir su información con:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Proveedores de Servicios Legales:</strong> abogados y bufetes que pueden
                ayudarle con su reclamo
              </li>
              <li>
                <strong>Proveedores de Servicios:</strong> terceros que nos ayudan a operar el
                Servicio (alojamiento, analíticas, gestión de relaciones con clientes)
              </li>
              <li>
                <strong>Requisitos Legales:</strong> cuando lo exija la ley o para proteger
                nuestros derechos
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              No vendemos su información personal a terceros para sus fines de mercadeo directo.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>5. Consentimiento de Comunicaciones</h2>
            <p>
              Al enviar su información de contacto, usted da su consentimiento expreso para recibir
              llamadas y mensajes de texto de nuestra parte y de nuestros socios con fines de
              mercadeo mediante tecnología automatizada. Puede recibir mensajes en cualquier
              momento, incluso antes de las 8:00 a.m. o después de las 9:00 p.m., hora local. El
              consentimiento no es una condición de compra. Pueden aplicarse tarifas de mensajes y
              datos.
            </p>
            <p style={{ marginTop: '12px' }}>
              Para dejar de recibir mensajes de texto, responda STOP a cualquier mensaje. Para
              dejar de recibir llamadas, informe al representante o comuníquese con nosotros usando
              los datos que aparecen más abajo.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>6. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger su
              información personal contra el acceso, la alteración, la divulgación o la destrucción
              no autorizados. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>7. Conservación de Datos</h2>
            <p>
              Conservamos su información personal durante el tiempo necesario para cumplir con los
              fines descritos en esta política, salvo que la ley exija un período de conservación
              más largo.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>8. Sus Derechos</h2>
            <p>Según su ubicación, usted puede tener derecho a:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Acceder a la información personal que tenemos sobre usted</li>
              <li>Solicitar la corrección de información inexacta</li>
              <li>Solicitar la eliminación de su información</li>
              <li>Optar por no participar en ciertas actividades de procesamiento de datos</li>
              <li>Retirar su consentimiento cuando el procesamiento se base en él</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Para ejercer estos derechos, comuníquese con nosotros usando los datos que aparecen
              más abajo.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>9. Cookies y Rastreo</h2>
            <p>
              Usamos cookies y tecnologías de rastreo similares para recopilar información de uso y
              mejorar el Servicio. Usted puede controlar las cookies desde la configuración de su
              navegador.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>10. Privacidad de Menores</h2>
            <p>
              El Servicio no está dirigido a personas menores de 18 años. No recopilamos
              intencionalmente información personal de menores de edad.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>11. Cambios a Esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Le informaremos de
              cualquier cambio publicando la nueva política en esta página y actualizando la fecha
              de &quot;Última actualización&quot;.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>12. Contáctenos</h2>
            <p>
              Si tiene preguntas sobre esta Política de Privacidad, comuníquese con nosotros:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px', listStyle: 'none' }}>
              <li>Correo electrónico: privacy@[your-domain].com</li>
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
