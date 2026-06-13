'use client'

import Hero from '../components/Hero';
import Stats from '../components/Stats';
import IdealClient from '../components/IdealClient';
import Quote from '../components/Quote';
import MaicoWhy from '../components/MaicoWhy';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function HomeView() {
  return (
    <>
      <Hero />
      <Stats />
      <IdealClient />
      <Quote />
      <MaicoWhy />
      <FAQ />
      <CTA />
    </>
  );
}
