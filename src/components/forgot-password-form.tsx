"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setResetError(null);
    setResetSuccess(false);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setResetError(error.message);
      return;
    }

    setSubmittedEmail(values.email);
    setResetSuccess(true);
  }

  async function handleResendEmail() {
    setResetError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(submittedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setResetError(error.message);
    }
  }

  if (resetSuccess) {
    return (
      <div className="space-y-10">
        {/* Icon and Title */}
        <div className="flex flex-col items-center gap-6">
          {/* Check Circle Icon */}
          <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h1 className="text-[40px] font-bold text-[#161410] leading-12 tracking-[-0.4px]">
              Check your email
            </h1>
            <div className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
              <p className="mb-0">
                We&apos;ve sent a password reset link to {submittedEmail}
              </p>
              <p>The link will expire in 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-8">
          {resetError && (
            <p className="text-sm text-destructive text-center" role="alert">
              {resetError}
            </p>
          )}
          
          <Button
            type="button"
            onClick={handleResendEmail}
            className="w-full h-14 rounded-sm bg-[#161410] hover:bg-[#161410]/90 text-white text-lg font-medium"
          >
            Resend email
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-base font-medium text-[#161410] hover:underline"
          >
            <ArrowLeft className="size-6" />
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-[40px] font-bold text-[#161410] leading-12 tracking-[-0.4px]">
          Forgot password
        </h1>
        <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base text-[#5e584b] font-medium">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@gmail.com"
                    autoComplete="email"
                    className="h-12 rounded-sm border-[#d6ceb8] text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {resetError && (
            <p className="text-sm text-destructive" role="alert">
              {resetError}
            </p>
          )}

          <div className="space-y-8">
            <Button
              type="submit"
              className="w-full h-14 rounded-sm bg-[#161410] hover:bg-[#161410]/90 text-white text-lg font-medium"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Sending…" : "Continue"}
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-base font-medium text-[#161410] hover:underline"
            >
              <ArrowLeft className="size-6" />
              Back to log in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
