"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  handleLogin,
  toggleShowPassword,
  setIsLoading,
  setIsRedirecting,
  LoginFormState,
  loginUserDispatch,
} from "@/lib/redux/slice/auth/loginSlice";
import { fetchCurrentUser, setUser } from "@/lib/redux/slice/user/userSlice";
import { UI_ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { HeaderTitle } from "@/components/utils/cardHeader";

// Form Schema Validation
const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required." }),
  password: z.string().trim().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isLoading, isRedirecting, showPassword } = useAppSelector(
    (state) => state.login,
  );

  const { user, status } = useAppSelector((state) => state.user);

  const isProcessing = isLoading || isRedirecting;

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // Reset overlay state whenever the login form mounts
    dispatch(setIsLoading(false));
    dispatch(setIsRedirecting(false));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.replace(UI_ROUTES.DASHBOARD);
      return;
    }

    if (status === "idle") {
      dispatch(fetchCurrentUser())
        .unwrap()
        .then(() => {
          toast.success("Welcome back!");
          router.replace(UI_ROUTES.DASHBOARD);
        })
        .catch(() => {
          // No active session found; stay on login page
        });
    }
  }, [user, status, dispatch, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (...event: any[]) => void,
  ) => {
    fieldOnChange(e);
    dispatch(
      handleLogin({
        name: e.target.name as keyof LoginFormState,
        value: e.target.value,
      }),
    );
  };

  async function onSubmit(values: LoginValues) {
    dispatch(setIsLoading(true));

    try {
      const resultAction = await dispatch(loginUserDispatch(values));

      if (loginUserDispatch.fulfilled.match(resultAction)) {
        toast.success("Logged in successfully!");

        dispatch(setIsLoading(false));
        dispatch(setIsRedirecting(true));

        const payload = resultAction.payload as any;
        const userData = payload?.data || payload?.user || payload;

        if (userData) {
          dispatch(setUser(userData));
        }

        // Redirect to dashboard
        router.replace(UI_ROUTES.DASHBOARD);
        router.refresh();
      } else if (loginUserDispatch.rejected.match(resultAction)) {
        dispatch(setIsLoading(false));
        dispatch(setIsRedirecting(false));

        const rawError = resultAction.payload as string;
        const formattedError =
          rawError?.replace(/^AUTH_ERROR:\s*/, "") ||
          "Invalid username or password.";

        toast.error("Authentication Failed", {
          description: formattedError,
        });
      }
    } catch {
      dispatch(setIsLoading(false));
      dispatch(setIsRedirecting(false));
    }
  }

  const handleForgotPassword = () => {
    router.push(UI_ROUTES.AUTH.FORGOT_PASSWORD);
  };

  return (
    <Card className="border-border/50 shadow-lg">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center space-y-3 transition-all duration-300">
          <Loader2 className="h-9 w-9 text-emerald-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">
            {isRedirecting
              ? "Redirecting to Dashboard..."
              : "Authenticating..."}
          </p>
        </div>
      )}
      <CardHeader className="space-y-5 pb-10 ">
        <HeaderTitle />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your username"
                        className="pl-9"
                        disabled={isProcessing}
                        {...field}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                      />
                    </div>
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
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isProcessing}
                      className="text-xs text-primary hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isProcessing}
                        className="pl-9 pr-9 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                        {...field}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isProcessing}
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => dispatch(toggleShowPassword())}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          Toggle password visibility
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-appointment-confirmed hover:bg-appointment-confirmed/90 text-white font-semibold shadow-md transition-all"
              disabled={isProcessing}
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRedirecting ? "Redirecting..." : "Sign In to Portal"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
