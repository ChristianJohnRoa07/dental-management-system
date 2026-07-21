"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Eye,
    EyeOff,
    Loader2,
    Stethoscope,
    Lock,
    Mail,
    ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Form Schema Validation
const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Please enter a valid clinic email address." }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." }),
    role: z.enum(["doctor", "hygienist", "receptionist", "admin"], {
        required_error: "Please select your staff role.",
    }),
    rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "doctor",
            rememberMe: false,
        },
    });

    async function onSubmit(values: LoginValues) {
        setIsLoading(true);
        console.log("Submitting login payload:", values);

        // Simulate API Call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect or set auth state here
        }, 1500);
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="dr.smith@dentalcare.com"
                                                className="pl-9"
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
                                                className="pl-9 pr-9"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
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
