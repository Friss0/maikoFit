import Link from 'next/link';
import styles from './terminos.module.css';

export const metadata = {
  title: 'Términos y Condiciones | MaicoFit',
  description: 'Términos y condiciones de uso, política de privacidad y de cookies de MaicoFit.',
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <h1 className={styles.title}>TÉRMINOS Y CONDICIONES</h1>
        <p className={styles.updated}>Última actualización: junio de 2026</p>
        <p className={styles.intro}>
          Estos términos regulan el uso del sitio de MaicoFit y la contratación de sus
          servicios de coaching. Al navegar el sitio o contratar un plan, aceptás estos
          términos. Si no estás de acuerdo, te pedimos que no utilices el sitio.
          {' '}<strong>Este documento es un modelo de referencia y debería ser revisado por
          un profesional legal antes de la publicación definitiva.</strong>
        </p>

        <section className={styles.section}>
          <h2>1. Quiénes somos</h2>
          <p>
            MaicoFit ofrece servicios de coaching fitness (entrenamiento, nutrición y
            acompañamiento) a través de planes online. Para consultas podés escribirnos
            por WhatsApp al +54 11 4403-6786.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Servicios y planes</h2>
          <p>
            Ofrecemos distintos planes (por ejemplo, Plan Esencial por suscripción mensual y
            Programa 1 a 1 por pago único). El detalle, alcance y precio de cada plan figura
            en la sección <Link href="/planes">Planes</Link>. Nos reservamos el derecho de
            modificar el contenido de los planes, avisando a los usuarios activos con
            antelación razonable.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Pagos y facturación</h2>
          <p>
            Los pagos se procesan a través de Mercado Pago. MaicoFit no almacena los datos
            de tu tarjeta: esa información la maneja directamente el procesador de pagos.
          </p>
          <ul>
            <li>El Plan Esencial es una suscripción de débito automático mensual hasta que la canceles.</li>
            <li>El Programa 1 a 1 es un pago único por el período contratado.</li>
            <li>Los precios están expresados en pesos argentinos (ARS) e incluyen impuestos cuando corresponda.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Garantía de 90 días</h2>
          <p>
            Si seguís el programa durante los 90 días y no lográs resultados, te devolvemos
            el importe abonado, según las condiciones comunicadas al momento de la
            contratación. La garantía requiere haber cumplido con el seguimiento y las pautas
            del plan.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cancelaciones y reembolsos</h2>
          <p>
            Podés cancelar la suscripción del Plan Esencial en cualquier momento desde tu
            cuenta; la cancelación detiene los cobros futuros. Para reembolsos por la garantía
            o por cobros indebidos, escribinos y los gestionamos según corresponda y según la
            normativa de defensa del consumidor vigente.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Uso responsable y salud</h2>
          <p>
            El contenido de MaicoFit tiene fines informativos y de entrenamiento, y no
            reemplaza el consejo médico profesional. Antes de comenzar cualquier programa de
            ejercicio o alimentación, consultá con un profesional de la salud, especialmente si
            tenés condiciones preexistentes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Propiedad intelectual</h2>
          <p>
            Todo el material (textos, imágenes, videos, rutinas y planes) es propiedad de
            MaicoFit y se entrega para tu uso personal. No está permitido reproducirlo,
            redistribuirlo ni comercializarlo sin autorización.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Privacidad y datos personales</h2>
          <p>
            Tratamos tus datos personales (como tu email) conforme a la Ley 25.326 de
            Protección de Datos Personales de Argentina. Usamos esa información para gestionar
            tu cuenta, procesar pagos y enviarte comunicaciones relacionadas con el servicio y,
            si lo aceptaste, novedades y ofertas. Podés solicitar el acceso, la rectificación o
            la baja de tus datos en cualquier momento escribiéndonos.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Política de cookies</h2>
          <p>
            Usamos cookies propias y de terceros para que el sitio funcione, recordar tus
            preferencias y entender cómo se usa (analítica). Podés aceptarlas o rechazarlas
            desde el aviso que aparece al ingresar, y gestionarlas desde la configuración de tu
            navegador. Rechazarlas puede afectar algunas funciones del sitio.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Cambios en estos términos</h2>
          <p>
            Podemos actualizar estos términos. Publicaremos la versión vigente en esta página
            con su fecha de actualización. El uso continuado del sitio implica la aceptación de
            los cambios.
          </p>
        </section>

        <Link className={styles.back} href="/">← Volver al inicio</Link>
      </div>
    </div>
  );
}
