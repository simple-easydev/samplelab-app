import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setLoginError(null);
    const supabase = createClient();
    
    // Add customer_ prefix to email for authentication
    const customerEmail = `customer_${values.email}`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: customerEmail,
      password: values.password,
    });

    if (error) {
      setLoginError(error.message);
      return;
    }

    navigate("/auth/callback")
  }

  async function handleGoogleSignIn() {
    setGoogleError(null);
    setIsLoadingGoogle(true);
    const supabase = createClient();
    // Only use window inside the click handler (client-only) to avoid hydration mismatch
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
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setIsLoadingGoogle(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Social login */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xs border-border bg-background font-medium text-base"
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
          className="w-full h-11 rounded-xs border-border bg-background font-medium"
          type="button"
        >
          <AppleIcon className="text-foreground" />
          Continue with Apple
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xs border-border bg-background font-medium"
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

      {/* Email & password form */}
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot Password?
            </Link>
          </div>
          {loginError && (
            <p className="text-sm text-destructive" role="alert">
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            className="w-full h-11 rounded-xs"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in…" : "Log in"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-foreground hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
