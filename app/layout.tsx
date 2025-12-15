import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { APP_NAME } from "@/lib/const";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
const appName = APP_NAME || "Stades Tan-Tan";

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: appName,
  },
  description: "Book your stadium seats easily.",
  keywords: "stadium, reservation, booking",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html className={inter.className}>
    //   <body>{children}</body>
    // </html>
    <>{children}</>
  );
}
