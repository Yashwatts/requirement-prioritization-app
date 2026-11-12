import { Inter, Open_Sans } from "next/font/google";
import { StoreProvider } from "@/store/store-provider";
import { SnackbarProvider } from "@/shared/snackbar/snackbar-provider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Requirement Prioritization",
  description: "Requirement Prioritization Application",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${inter.variable}`}>
      <body className={openSans.className} suppressHydrationWarning>
        <StoreProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
