"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/hooks/pages/useLogin";
import EmailInput from "@/components/sections/auth/login/EmailInput";
import PasswordInput from "@/components/sections/auth/login/PasswordInput";
import GoogleSignInButton from "@/components/sections/auth/login/GoogleSignInButton";

function LoginInner() {
  const {
    email,
    password,
    isLoading,
    showPassword,
    errors,
    generalError,
    setField,
    toggleShowPassword,
    handleSubmit,
    handleGoogleSignIn,
  } = useLogin();

  // Now use useSearchParams within the inner component
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  // 🔹 Start with 'false' if there are query params; otherwise 'true'
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showErrorEmail, setShowErrorEmail] = useState(false);
  const [isSubmited, setIsSubmited] = useState(true);

  useEffect(() => {
    if (errors.password) {
      setShowErrorPassword(true);
    }
  }, [password !== "" && email !== "", isSubmited]);

  useEffect(() => {
    if (errors.email) {
      setShowErrorEmail(true);
    }
  }, [password !== "" && email !== "", isSubmited]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Log in to your account</p>
        </div>

        {generalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput
            email={email}
            setField={setField}
            error={showErrorEmail ? errors.email : ""}
          />
          <PasswordInput
            password={password}
            setField={setField}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            error={showErrorPassword ? errors.password : ""}
          />
          <div className="flex items-center justify-between">
            <Link
              href={`/auth/forgot-password?${queryString}`}
              className="font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={() => setIsSubmited(false)}
          >
            {isLoading ? "Logging in..." : "Log In"}{" "}
            <LogIn className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleSignInButton handleGoogleSignIn={handleGoogleSignIn} />
          </div>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <Link href={`/auth/signup?${queryString}`}>
            <Button variant="outline" className="w-full mt-6">
              Create an Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginInner />
    </Suspense>
  );
}
