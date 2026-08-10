"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReturnButton } from "@/components/utils/returnButton";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HeaderTitle } from "@/components/utils/cardHeader";
import { UI_ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import {
  forgotPasswordDispatch,
  resetForgotPasswordForm
} from "@/lib/redux/slice/auth/forgotPasswordSlice";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSubmitting, isSubmitted, errorMessage } = useAppSelector(
    (state) => state.forgotPassword,
  );

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSubmitted) {
      timer = setTimeout(() => {
        dispatch(resetForgotPasswordForm());
        form.reset({ email: "" });
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [isSubmitted, dispatch, form]);

  async function onSubmit(values: ForgotPasswordValues) {
    await dispatch(forgotPasswordDispatch(values));
  }

  const handleBacktoLogin = () => {
    router.push(UI_ROUTES.AUTH.LOGIN);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border border-border">
      <CardHeader className="text-center mb-3.5">
        <div className="mb-5">
          <HeaderTitle />
        </div>

        <CardDescription>
          {isSubmitted
            ? "Check your inbox for the reset link"
            : "Enter your email address to receive a password reset link."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4">
            <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">
                If an account exists for{" "}
                <span className="font-bold">{form.getValues("email")}</span>, a
                password reset link has been dispatched.
              </AlertDescription>
            </Alert>
            <p className="text-xs text-muted-foreground text-center">
              Didn't receive an email? Check your spam folder or try again in a
              few minutes.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-9"
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
                className="w-full bg-appointment-confirmed hover:bg-appointment-confirmed/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t p-4">
        <ReturnButton onClick={handleBacktoLogin} title="Back to Login" />
      </CardFooter>
    </Card>
  );
}
