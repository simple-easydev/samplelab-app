import Link from "next/link";
import Image from "next/image";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata = {
  title: "Forgot Password — The Sample Lab",
  description: "Reset your password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#fffbf0] px-4">
      {/* Logo */}
      <div className="flex w-full items-center justify-center pt-6 pb-12">
        <Link href="/" className="flex flex-col items-center gap-0">
          <Image
            src="/logo.svg"
            alt="The Sample Lab"
            width={144}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[356px] pt-24">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
