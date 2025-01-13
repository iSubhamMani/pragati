import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { WalletContextProvider } from "@/context/wallet";

const font = Quicksand({
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pragati",
  description: "Empowering the sustainable development of the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WalletContextProvider>
        <body className={`${font.className} antialiased`}>
          <Toaster />
          {children}
        </body>
      </WalletContextProvider>
    </html>
  );
}
