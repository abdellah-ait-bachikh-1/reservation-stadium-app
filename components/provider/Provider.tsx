"use client";

import { AuthContextProvider } from "@/context/authContext";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
export function Providers({
  children,
  locale,
  className,
}: {
  children: React.ReactNode;
  locale: string;
  className?: string;
}) {
  return (
    <AuthContextProvider>
      <SessionProvider>
        <HeroUIProvider
          locale={locale}
          className={`min-h-screen w-full z-99999 ${className}`}
        >
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            key={"theme"}
            storageKey="theme"
          >
            {children}
            <div className="z-99999">
              <ToastProvider
                toastProps={{
                  classNames: { base: "z-99999" ,motionDiv:"z-99999"},
                }}
                placement="bottom-right"
              />
            </div>
          </NextThemesProvider>
        </HeroUIProvider>
      </SessionProvider>
    </AuthContextProvider>
  );
}
