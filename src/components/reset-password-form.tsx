"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  
  const passwordError = form.formState.errors.password;
  const confirmPasswordError = form.formState.errors.confirmPassword;
  
  const isPasswordValid = password.length >= 8 && !passwordError;
  const isConfirmPasswordValid = confirmPassword.length > 0 && password === confirmPassword && !confirmPasswordError;
  const hasConfirmPasswordError = confirmPassword.length > 0 && confirmPasswordError;

  async function onSubmit(values: ResetPasswordValues) {
    setResetError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setResetError(error.message);
      return;
    }

    // Redirect to dashboard after successful password reset
    router.push("/dashboard");
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-[40px] font-bold text-[#161410] leading-12 tracking-[-0.4px]">
          Reset password
        </h1>
        <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
          Choose a new password for your account.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Password Inputs */}
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base text-[#5e584b] font-medium">
                    New password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        className={cn(
                          "h-12 rounded-sm text-sm pr-10",
                          isPasswordValid && "border-[#1f7f59] focus-visible:border-[#1f7f59]",
                          passwordError && password.length > 0 && "border-[#cb4b37] focus-visible:border-[#cb4b37]"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f7766] hover:text-[#5e584b] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <Eye className="size-6" />
                        ) : (
                          <EyeOff className="size-6" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <div className="flex items-center gap-1">
                    {isPasswordValid && (
                      <Check className="size-4 text-[#1a6548]" />
                    )}
                    <FormDescription className={cn(
                      "text-xs tracking-[0.2px]",
                      isPasswordValid ? "text-[#1a6548]" : "text-[#7f7766]"
                    )}>
                      At least 8 characters
                    </FormDescription>
                  </div>
                  {passwordError && password.length > 0 && (
                    <FormMessage className="text-[#b3402d]" />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base text-[#5e584b] font-medium">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={cn(
                          "h-12 rounded-sm text-sm pr-10",
                          isConfirmPasswordValid && "border-[#1f7f59] focus-visible:border-[#1f7f59]",
                          hasConfirmPasswordError && "border-[#cb4b37] focus-visible:border-[#cb4b37]"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f7766] hover:text-[#5e584b] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <Eye className="size-6" />
                        ) : (
                          <EyeOff className="size-6" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {isConfirmPasswordValid && (
                    <div className="flex items-center gap-1">
                      <Check className="size-4 text-[#02795c]" />
                      <p className="text-xs text-[#02795c] tracking-[0.2px]">
                        Password match
                      </p>
                    </div>
                  )}
                  {hasConfirmPasswordError && (
                    <div className="flex items-center gap-1">
                      <X className="size-4 text-[#b3402d]" />
                      <p className="text-xs text-[#b3402d] tracking-[0.2px]">
                        {confirmPasswordError.message}
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          {resetError && (
            <p className="text-sm text-destructive" role="alert">
              {resetError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-14 rounded-sm bg-[#161410] hover:bg-[#161410]/90 text-white text-lg font-medium"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Resetting…" : "Reset password & log in"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
