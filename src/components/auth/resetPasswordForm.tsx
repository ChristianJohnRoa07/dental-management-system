"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UI_ROUTES } from "@/lib/routes";
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react";
import { ReturnButton } from "../utils/returnButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { HeaderTitle } from "../utils/cardHeader";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";

import { resetPasswordDispatch } from "@/lib/redux/slice/auth/resetPasswordSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { isSubmitting, isSubmitted, errorMessage } = useAppSelector(
    (state) => state.resetPassword,
  );

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        router.push(UI_ROUTES.AUTH.LOGIN);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, router]);

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!token) return;

    await dispatch(
      resetPasswordDispatch({
        token,
        newPassword: values.password,
      })
    );
  };

  const handleForgotPassword = () => {
    router.push(UI_ROUTES.AUTH.FORGOT_PASSWORD);
  };

  const handleBackToLogin = () => {
    router.push(UI_ROUTES.AUTH.LOGIN);
  };

  // Missing Token View
  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="text-center mb-3.5">
          <div className="mb-5">
            <HeaderTitle />
          </div>
          <CardDescription className="text-destructive font-medium">
            Invalid or Missing Link
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-xs text-muted-foreground">
            This password reset link is missing a valid security token or has
            expired. Please request a new link.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4">
          <ReturnButton
            onClick={handleForgotPassword}
            title="Request New Link"
          />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg border border-border">
      <CardHeader className="text-center mb-3.5">
        <div className="mb-5">
          <HeaderTitle />
        </div>

        <CardDescription className="mt-2 text-center text-sm text-gray-600">
          {isSubmitted
            ? "Your password has been successfully reset"
            : "Enter your new password below."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4">
            <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                Password updated successfully!
              </AlertDescription>
            </Alert>
            <p className="text-xs text-muted-foreground text-center">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400  focus:outline-none focus:ring-1  disabled:bg-gray-100"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400  focus:outline-none focus:ring-1  disabled:bg-gray-100"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-appointment-confirmed hover:bg-appointment-confirmed/90 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t p-4">
        <ReturnButton onClick={handleBackToLogin} title="Back to Login" />
      </CardFooter>
    </Card>
  );
}
