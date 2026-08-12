'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: '¿Cuánto vale mi accidente?',
    answer: (
      <>
        <p>
          La verdad es que depende de su situación: la gravedad de sus lesiones, sus facturas médicas y los días de
          trabajo que perdió influyen en el resultado. ¿La buena noticia? Revisamos cada detalle y luchamos para que
          reciba cada dólar que merece. Complete la breve encuesta de arriba para ver si califica.
        </p>
      </>
    ),
  },
  {
    question: '¿Puedo recibir dinero por dolor y sufrimiento?',
    answer: (
      <>
        <p>
          Sí, puede. Si desde el accidente ha vivido con dolor físico, estrés emocional o cambios importantes en su
          vida diaria, eso cuenta, y es posible que reciba una compensación por ello además de sus otras pérdidas.
        </p>
      </>
    ),
  },
  {
    question: '¿Tendré que ir a la corte?',
    answer: (
      <>
        <p>
          Probablemente no. La mayoría de los casos se resuelven mucho antes de que alguien pise una sala de corte.
          Pero si la compañía de seguros no actúa de forma justa, no se preocupe: estamos de su lado y listos para
          llevar el caso a la corte y luchar por usted.
        </p>
      </>
    ),
  },
  {
    question: '¿Qué pasa si no tengo seguro médico?',
    answer: (
      <>
        <p>
          ¿Sin seguro? No hay problema, usted todavía puede presentar un reclamo. Si resultó lesionado, faltó al
          trabajo o tiene facturas médicas acumulándose, vale mucho la pena hablar con un abogado. Las compañías de
          seguros casi nunca ofrecen lo que su caso realmente vale, y el abogado indicado puede exigir más. Uno de
          nuestros especialistas con gusto revisará su situación y responderá sus preguntas primero, sin ninguna
          presión para contratar a nadie.
        </p>
      </>
    ),
  },
  {
    question: '¿Cuánto tiempo tomará mi caso o acuerdo?',
    answer: (
      <>
        <p>
          Cada caso avanza a su propio ritmo. Algunos se resuelven en unas pocas semanas, mientras que otros toman
          varios meses o más. Haremos que su caso avance lo más rápido posible, pero nunca lo presionaremos a aceptar
          un acuerdo por menos de lo que merece solo para terminar pronto.
        </p>
      </>
    ),
  },
  {
    question: '¿Cuánto cuesta un abogado de accidentes?',
    answer: (
      <>
        <p>
          Esta es la parte que a todos les gusta: la mayoría de los abogados de accidentes automovilísticos no cobran
          nada por adelantado. Solo reciben pago si ganan su caso, y esos honorarios salen de su acuerdo, nunca de su
          propio bolsillo.
        </p>
      </>
    ),
  },
  {
    question: '¿Necesito un abogado para cada accidente de auto?',
    answer: (
      <>
        <p>
          No siempre, pero si resultó lesionado, perdió días de trabajo o tiene facturas médicas que pagar, es muy
          buena idea hablar con un abogado. Las aseguradoras no siempre ofrecen lo que usted realmente merece, y un
          buen abogado puede luchar para conseguirle más. Después de revisar su caso, lo conectamos con un abogado
          local listo para intervenir y buscar la mayor compensación posible para usted.
        </p>
      </>
    ),
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2>Preguntas Frecuentes</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <button 
              className="faq-question" 
              onClick={() => toggleItem(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
