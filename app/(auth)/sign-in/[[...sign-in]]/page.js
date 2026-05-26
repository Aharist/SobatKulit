import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Masuk — SobatKulit',
  description: 'Masuk ke akun SobatKulit untuk mengakses fitur pemindaian kulit AI.',
};

export default function SignInPage() {
  return <SignIn path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/" />;
}
