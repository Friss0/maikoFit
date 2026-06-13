'use client'
import { useState } from 'react';
import s from './FAQ.module.css';

const faqs = [
  {
    q: '¿Cuánto tiempo lleva ver los primeros resultados?',
    a: 'La mayoría de los clientes nota cambios visibles en las primeras 3 a 4 semanas: más energía, mejor sueño y los primeros cambios físicos. Los resultados más significativos se consolidan entre los 60 y 90 días de trabajo constante.',
  },
  {
    q: '¿Necesito experiencia previa en el gimnasio?',
    a: 'No. El programa se adapta a tu punto de partida, ya sea que nunca hayas entrenado o que lleves años en el gym. La evaluación inicial determina exactamente desde dónde arrancás.',
  },
  {
    q: '¿En qué se diferencia el plan 1 a 1 del plan Esencial?',
    a: 'El plan Esencial te da estructura y herramientas para avanzar de forma autónoma. El 1 a 1 incluye seguimiento semanal personalizado, ajustes constantes según tu progreso real y contacto directo por WhatsApp en todo momento.',
  },
  {
    q: '¿Puedo hacer el programa si trabajo muchas horas por día?',
    a: 'Sí — de hecho eso es exactamente para lo que está diseñado. El programa se adapta a tu disponibilidad real: si trabajás mucho, viajás o tenés familia, el plan lo contempla. No hay excusas que el programa no haya visto antes.',
  },
  {
    q: '¿Qué pasa si no logro resultados en los 90 días?',
    a: 'Garantía total. Si seguís el programa los 90 días y no lográs el cambio, te devuelvo la plata íntegra. Sin letra chica, sin excusas. No vas a perder ni tiempo ni dinero.',
  },
  {
    q: '¿Con qué frecuencia hablo con Maico durante el programa?',
    a: 'En el plan 1 a 1 tenés seguimiento semanal y acceso directo por WhatsApp para consultas entre sesiones. Nunca vas a estar solo frente a una duda o un obstáculo.',
  },
  {
    q: '¿El programa incluye plan de alimentación?',
    a: 'Sí. El plan 1 a 1 incluye nutrición deportiva personalizada diseñada junto a una licenciada. No es una dieta genérica: es un plan adaptado a tu cuerpo, tus objetivos y tu estilo de vida.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className={s.faq} id="faq">
      <div className={s.inner}>

        {/* Columna izquierda */}
        <div className={s.left}>
          <span className={s.tag}>Preguntas frecuentes</span>
          <h2 className={s.heading}>
            TODO LO<br />QUE<br />NECESITÁS<br />SABER
          </h2>
          <p className={s.subtext}>
            Si tenés una duda que no está acá, escribime directo por WhatsApp.
          </p>
          <a
            className={s.waLink}
            href="https://wa.me/541144036786?text=Hola%20Maico!%20Tengo%20una%20consulta"
            target="_blank"
            rel="noreferrer"
          >
            Escribime por WhatsApp →
          </a>
        </div>

        {/* Columna derecha — accordion */}
        <div className={s.right}>
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`${s.item}${open === i ? ` ${s.itemOpen}` : ''}`}
              onClick={() => toggle(i)}
            >
              <div className={s.question}>
                <span className={s.questionText}>{item.q}</span>
                <span className={s.icon} aria-hidden="true">
                  {open === i ? '−' : '+'}
                </span>
              </div>
              {open === i && (
                <div className={s.answer}>{item.a}</div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
