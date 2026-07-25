import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import StoreProvider from "@/lib/redux/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Dr. Jones",
    description: "Dental Management Portal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${jakarta.variable} font-sans h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <StoreProvider>
                    {children}
                    <Toaster richColors position="top-center" />
                </StoreProvider>
            </body>
        </html>
    );
}
