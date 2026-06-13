import { Suspense } from 'react';
import AuthForm from '../../src/components/AuthForm';

export const metadata = { title: 'Iniciar sesión | MaicoFit' };

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
