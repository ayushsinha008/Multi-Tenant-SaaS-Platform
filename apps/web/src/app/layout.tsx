import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS Platform",
  description: "A production-ready Multi-Tenant SaaS Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} bg-[#ECECEC] text-[#000000] selection:bg-[#00FF4C] selection:text-black antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
