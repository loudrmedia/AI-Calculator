'use client';

import { AllSourcesTable } from '../../components/CitationRenderer';
import { MODEL_VERSION } from '../../lib/sources';

export default function SourcesPage() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Fuentes de Datos y Metodología</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>
          Versión del modelo de la calculadora: {MODEL_VERSION}
        </p>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          Cada cifra de nuestros estimados proviene de fuentes disponibles públicamente.
          Esta página ofrece total transparencia sobre nuestra metodología y nuestros datos.
        </p>

        <div style={{ 
          background: '#eff6ff', 
          border: '1px solid #3b82f6', 
          borderRadius: '8px', 
          padding: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '16px', color: '#1e40af', marginBottom: '8px' }}>
            Nuestro Compromiso con la Transparencia
          </h3>
          <p style={{ color: '#1e40af', fontSize: '14px', margin: 0 }}>
            Creemos que usted merece saber exactamente cómo se calculó su estimado.
            Haga clic en cualquier enlace de fuente para verificar los datos usted mismo.
          </p>
        </div>

        <AllSourcesTable />

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Cómo Calculamos los Estimados</h2>
          
          <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Modelo A: Sin Abogado (Rango de Acuerdo Temprano)
            </h3>
            <p>
              Este modelo estima lo que usted podría recibir en un acuerdo temprano y directo con
              la aseguradora. Utiliza:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Monto Base:</strong> promedio de reclamos pagados del Insurance Information
                Institute por lesiones corporales ($28,278) y daños materiales ($6,770)
              </li>
              <li>
                <strong>Ajuste por Gravedad:</strong> aplicado según la categoría de la lesión
                (tejido blando: 15%, sustancial: 50%, catastrófica: 100%)
              </li>
              <li>
                <strong>Modificadores:</strong> ajustes por responsabilidad y por la fecha del accidente
              </li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Modelo B: Con Abogado (Rango Negociado)
            </h3>
            <p>
              Este modelo estima los resultados posibles con representación legal, incluyendo
              daños no económicos:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Base Económica:</strong> el mismo cálculo del Modelo A
              </li>
              <li>
                <strong>No Económicos (Dolor y Sufrimiento):</strong> método del multiplicador
                (de 1.5× a 5× los daños económicos) según los marcos estándar de la industria
                documentados por Lawyers.com
              </li>
              <li>
                <strong>Neto Después de Honorarios:</strong> monto bruto menos un honorario
                contingente ilustrativo del 33% (los honorarios reales varían según el abogado)
              </li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '8px' }}>
              Política de Redondeo
            </h3>
            <p>
              Todos los estimados monetarios se <strong>redondean HACIA ARRIBA</strong> al dólar
              más cercano para su presentación.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Limitaciones Importantes</h2>
          
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #f59e0b', 
            borderRadius: '8px', 
            padding: '20px'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Solo Ilustrativo:</strong> estos estimados son educativos y no predicen el
                resultado real de un caso
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>No Es Asesoría Legal:</strong> consulte con un abogado calificado para
                recibir asesoría específica sobre su situación
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Promedios de la Industria:</strong> las cifras de las fuentes representan
                promedios, no predicciones de casos individuales
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Varía Según la Jurisdicción:</strong> las leyes, las prácticas de seguros y
                los resultados varían considerablemente de un estado a otro
              </li>
              <li>
                <strong>Muchos Factores:</strong> el valor real de un caso depende de los hechos
                específicos, la evidencia, los límites de cobertura y muchos otros factores que
                este modelo simplificado no considera
              </li>
            </ul>
          </div>
        </section>

        <section style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Política de Actualización de Fuentes</h2>
          <p style={{ color: 'var(--gray-700)' }}>
            Revisamos y actualizamos periódicamente los datos de nuestras fuentes para garantizar su
            exactitud. Cada estimado incluye un número de versión del modelo que corresponde a los
            datos utilizados. Si recibió un estimado con una versión anterior, es posible que los
            datos subyacentes se hayan actualizado desde entonces.
          </p>
        </section>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            ← Volver a la Calculadora
          </a>
        </div>
      </div>
    </div>
  );
}
