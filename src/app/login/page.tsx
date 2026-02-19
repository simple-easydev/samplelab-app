import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export const metadata = {
  title: "Log in — The Sample Lab",
  description: "Log in to your account to continue.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-0">
          <Image
            src="/logo.svg"
            alt="The Sample Lab"
            width={144}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Welcome */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Please log in to your account to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
