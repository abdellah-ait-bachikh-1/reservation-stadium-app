"use client";

import { AuthContextProvider } from "@/context/authContext";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <AuthContextProvider>
      <HeroUIProvider locale={locale} className="min-h-screen w-fullz-99999">
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          key={"theme"}
          storageKey="theme"
        >
          {children}
          <ToastProvider
            toastProps={{
              classNames: { base: "z-99999" },
            }}
            placement="bottom-right"
          />
        </NextThemesProvider>
      </HeroUIProvider>
    </AuthContextProvider>
  );
}
