import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Hooks/useAuth.hook";
import { Toaster } from "react-hot-toast"; // ✅ Import toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INKARAAI",
  description: "Try before you imagine your body art",
  icons: {
    icon: "/logoinkara.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} /> 
        </AuthProvider>
      </body>
    </html>
  );
}
