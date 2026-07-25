import { LoginForm } from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="flex w-full max-w-xl flex-col items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full text-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}