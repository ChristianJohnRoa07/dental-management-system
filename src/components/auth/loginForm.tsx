"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
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
import { HeaderTitle } from "@/components/auth/cardHeader";
import { DENTAL_PALETTE } from "@/lib/common/colors";

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
        
        const userResult = await dispatch(fetchCurrentUser());

        if (fetchCurrentUser.fulfilled.match(userResult)) {

          dispatch(setIsLoading(false));
          dispatch(setIsRedirecting(true));

          router.replace(UI_ROUTES.DASHBOARD);
          
        } else {
          
          dispatch(setIsLoading(false));
          dispatch(setIsRedirecting(false));

          const userError = userResult.payload as string;
          toast.error("Session Error", {
            description: userError || "Failed to load user profile.",
          });
        }

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
    <Card className="relative overflow-hidden w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md bg-white">
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

      <HeaderTitle />

      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-slate-800">
                    Username
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Enter your username"
                        className="pl-9 h-11 rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm"
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-slate-800">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        disabled={isProcessing}
                        className="pl-9 pr-10 h-11 rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                        {...field}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isProcessing}
                        className="absolute right-1 top-1 h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-transparent"
                        onClick={() => dispatch(toggleShowPassword())}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
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

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isProcessing}
                className="font-medium text-slate-800 hover:text-slate-900 hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              style={{ backgroundColor: DENTAL_PALETTE.primary.DEFAULT }}
              className="w-full h-11 hover:opacity-90 text-white font-medium rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-2"
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isRedirecting ? "Redirecting..." : "Log in to portal"}
              </span>
              {!isProcessing && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
