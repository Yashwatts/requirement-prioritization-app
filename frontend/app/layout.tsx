import { Open_Sans } from "next/font/google";
import { SnackbarProvider } from "@/components/snackbar/snackbar-provider";
import type { Metadata } from "next";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Requirement Prioritization",
  description: "Requirement Prioritization Application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className={openSans.className}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
