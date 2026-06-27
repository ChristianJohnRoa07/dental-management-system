import Image from "next/image";

export default async function Home() {
  let apiData = { message: "Failed to connect to backend", timestamp: "" };

  try {
    // Fetch data from our newly created backend API route
    // Using an absolute URL works best across both server and client environments
    const res = await fetch("http://localhost:3000/api/test", { cache: "no-store" });
    if (res.ok) {
      apiData = await res.json();
    }
  } catch (error) {
    console.error("Error fetching from API:", error);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-6 text-center">
          <h1 className="text-4xl font-bold text-blue-400">Next.js Full-Stack App</h1>

          <div className="p-6 bg-slate-800 rounded-lg border border-slate-750 shadow-xl max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2 text-green-400">Frontend Connected!</h2>
            <p className="text-slate-400 text-xs mb-4">Response from Backend API:</p>

            <div className="bg-slate-950 p-4 rounded font-mono text-left text-sm text-amber-300 overflow-x-auto">
              <p>💬 <span className="text-white">Message:</span> "{apiData.message}"</p>
              <p className="mt-2">🕒 <span className="text-white">Time:</span> {apiData.timestamp || "N/A"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
