import Image from "next/image";

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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold text-blue-400">Next.js Full-Stack App</h1>
        </div>
      </main>
    </div>
  );
}
