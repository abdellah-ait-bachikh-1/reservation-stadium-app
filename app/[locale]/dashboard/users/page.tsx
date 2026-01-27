import { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import UsersClient from "@/components/dashboard/users/UsersClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../../messages/${locale}.json`)).default;

  return {
    title: `${messages.pages?.dashboard?.users?.metadata?.title || "Users Management"} - ${messages.common?.appName || "Tantan Stadium Booking"}`,
    description: messages.pages?.dashboard?.users?.metadata?.description,
  };
}

const UsersPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const session = await getSession();

  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" });
    return;
  }

  if (session.user.role !== "ADMIN") {
    redirect({ locale: locale, href: "/dashboard" });
    return;
  }

  return <UsersClient locale={locale} />;
};

export default UsersPage;