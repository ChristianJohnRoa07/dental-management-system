"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Eye, EyeOff, Loader2, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    LoginFormState,
    loginUser,
} from "@/lib/redux/slice/login/loginSlice";

// Form Schema Validation
const loginSchema = z.object({
    username: z.string().trim().min(1, { message: "Username is required." }),
    password: z.string().trim().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const dispatch = useAppDispatch();
    const { isLoading, showPassword, loginError } = useAppSelector(
        (state) => state.login,
    );

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

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
        console.log("Submitting login payload:", values);

        const resultAction = await dispatch(loginUser(values));

        if (loginUser.fulfilled.match(resultAction)) {
            console.log("Login successful:", resultAction.payload);
            // TODO: Add navigation or post-login redirect here
        }
        else if(loginUser.rejected.match(resultAction)){
            const rawError = resultAction.payload as string;
            const formattedError = rawError?.replace(/^AUTH_ERROR:\s*/, "") || "Invalid username or password.";

            toast.error("Authentication Failed", {
                description: formattedError,
            });
        }
    }

    return (
        <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 pb-10 ">
                <CardTitle className="text-3xl font-bold tracking-tight text-center">
                    Dr. Jones Dental Management Portal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                                {...field}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        field.onChange,
                                                    )
                                                }
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
                                        <a
                                            href="#"
                                            className="text-xs text-primary hover:underline font-medium"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className="pl-9 pr-9 [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                                {...field}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        field.onChange,
                                                    )
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    dispatch(
                                                        toggleShowPassword(),
                                                    )
                                                }
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
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In to Portal
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
