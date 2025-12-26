"use client";
import { Link } from "@/i18n/navigation";
import { TLocale } from "@/lib/types";
import { Spinner } from "@heroui/spinner";
import { button, cn } from "@heroui/theme";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";

const HeroButton = ({ locale }: { locale: TLocale }) => {
  const session = useSession();
  const t = useTranslations("Components.Header.labels");
  if (session.status === "loading") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Spinner />
      </div>
    );
  }
  if (!session || !session.data) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          className={cn(
            button({
              variant: "shadow",
              size: "lg",
              color: "success",
              radius: "lg",
            }),
            "px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
          )}
          href="/auth/login"
          hrefLang={locale}
          prefetch={true}
        >
          <FaSignInAlt className="w-4 h-4 mr-2" />
          {t("signIn")}
        </Link>

        <Link
          className={cn(
            button({
              variant: "flat",
              size: "lg",
              color: "primary",
              radius: "lg",
            }),
            "px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
          )}
          href="/auth/register"
          hrefLang={locale}
          prefetch={true}
        >
          <FaUserPlus className="w-4 h-4 mr-2" />

          {t("register")}
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        href="/dashboard"
        className={cn(
          button({
            variant: "shadow",
            size: "lg",
            color: "warning",
            radius: "lg",
          }),
          "px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform duration-200"
        )}
        hrefLang={locale}
        prefetch={true}
      >
        <TbLayoutDashboard className="w-4 h-4 mr-2" />
        {t("dashboard")}
      </Link>
    </div>
  );
};

export default HeroButton;
