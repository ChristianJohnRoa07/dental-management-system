import { Button } from "@/components/ui/button"
import { Mail, ArrowRight, Plus } from "lucide-react"

import { Login } from "./ui/Login/Login";

export default async function Home() {
  let apiData = null;

  try {
    const res = await fetch("http://localhost:3000/api/test", { cache: "no-store" });
    if (res.ok) {
      apiData = await res.json();
    }
  } catch (error) {
    console.error("Failed to connect to backend server during boot:", error);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="flex w-full max-w-xl flex-col items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full text-sm">
          <Login />
        </div>
      </main>
    </div>
  );
}
