import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'Daftar — SobatKulit',
  description: 'Buat akun SobatKulit untuk memulai pemindaian dan pemantauan kondisi kulit.',
};

export default function SignUpPage() {
  return <SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />;
}
