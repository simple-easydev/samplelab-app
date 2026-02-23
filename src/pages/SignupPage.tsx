import { Link } from 'react-router-dom';
import { SignupForm } from '@/components/signup-form';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[544px] space-y-8">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center gap-0">
          <img
            src="/logo.svg"
            alt="The Sample Lab"
            width={144}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Heading */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground">
            Create an account to download samples and manage your credits.
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
