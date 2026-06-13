'use client'

import PageHeader from '../components/PageHeader';
import Plans from '../components/Plans';
import BeforeAfter from '../components/BeforeAfter';
import CTA from '../components/CTA';

export default function PlanesView() {
  return (
    <>
      <PageHeader
        tag="Elegí tu camino"
        title="PLANES"
        sub="Dos formas de empezar tu transformación. Una garantía que no te hace perder ni tiempo ni plata."
      />
      <Plans />
      <BeforeAfter />
      <CTA showPlans={false} />
    </>
  );
}
