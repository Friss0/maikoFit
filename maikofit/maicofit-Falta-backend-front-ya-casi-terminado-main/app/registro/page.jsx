import { Suspense } from 'react';
import AuthForm from '../../src/components/AuthForm';

export const metadata = { title: 'Crear cuenta | MaicoFit' };

export default function RegistroPage() {
  return (
    <Suspense>
      <AuthForm mode="registro" />
    </Suspense>
  );
}
