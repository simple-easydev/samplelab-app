import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Circle, Eye, EyeOff, X } from "lucide-react";
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
import { GoogleIcon, AppleIcon, FacebookIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please re-enter your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupValues) {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("sign-up", {
      body: {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      },
    });

    if (error) {
      setSuccessMessage(null);
      const message =
        (data as { error?: string } | null)?.error ??
        error.message ??
        "Something went wrong. Please try again.";
      form.setError("root", { type: "server", message });
      return;
    }

    const result = data as { success?: boolean; message?: string; user_id?: string } | null;
    if (result?.success) {
      form.reset();
      form.clearErrors("root");
      setSuccessMessage(
        result.message ?? "Account created. Please check your email to confirm your account."
      );
      return;
    }

    setSuccessMessage(null);
    form.setError("root", {
      type: "server",
      message: "Something went wrong. Please try again.",
    });
  }

  async function handleGoogleSignIn() {
    setGoogleError(null);
    setIsLoadingGoogle(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setGoogleError(error.message);
      setIsLoadingGoogle(false);
      return;
    }
    if (data?.url) window.location.href = data.url;
    else setIsLoadingGoogle(false);
  }

  return (
    <div className="space-y-6">
      {/* Social login */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-12 w-full rounded-xs border-border bg-background font-medium text-base"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoadingGoogle}
        >
          <GoogleIcon className="size-6 text-foreground" />
          {isLoadingGoogle ? "Signing in…" : "Continue with Google"}
        </Button>
        {googleError && (
          <p className="text-sm text-destructive" role="alert">
            {googleError}
          </p>
        )}
        <Button
          variant="outline"
          className="h-11 w-full rounded-xs border-border bg-background font-medium"
          type="button"
        >
          <AppleIcon className="text-foreground" />
          Continue with Apple
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full rounded-xs border-border bg-background font-medium"
          type="button"
        >
          <FacebookIcon className="text-foreground" />
          Continue with Facebook
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-sm text-muted-foreground">
            or
          </span>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="h-11 rounded-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      className="h-11 rounded-xs pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <div className="flex items-center gap-2 text-xs">
                  {field.value.length >= 8 ? (
                    <>
                      <Check className="size-3.5 shrink-0 text-green-600" aria-hidden />
                      <span className="text-green-600">At least 8 characters</span>
                    </>
                  ) : (
                    <>
                      <Circle className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="text-muted-foreground">At least 8 characters</span>
                    </>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => {
              const password = form.watch("password");
              const hasError = !!fieldState.error;
              const isMatch =
                field.value.length > 0 &&
                password.length > 0 &&
                field.value === password;
              return (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={cn(
                          "h-11 rounded-xs pr-10",
                          hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                        )}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {hasError ? (
                    <div className="flex items-center gap-2 text-xs text-destructive" role="alert">
                      <X className="size-3.5 shrink-0" aria-hidden />
                      <span>{fieldState.error?.message ?? "Passwords don't match"}</span>
                    </div>
                  ) : isMatch ? (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <Check className="size-3.5 shrink-0" aria-hidden />
                      <span>Password match</span>
                    </div>
                  ) : null}
                </FormItem>
              );
            }}
          />
          {form.formState.errors.root?.message && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.root.message}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600" role="status">
              {successMessage}
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            By clicking on &quot;Create account&quot; you agree to{" "}
            <Link
              to="/terms"
              className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              Terms &amp; Privacy Policy
            </Link>
          </p>
          <Button
            type="submit"
            className="h-11 w-full rounded-xs"
            size="lg"
            suppressHydrationWarning
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
