import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { APP_NAME, APP_NAMES } from "@/lib/const";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <>{children}</>
  );
}
