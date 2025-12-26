import LoginForm from "@/components/auth/LoginForm";
import { Link } from "@/i18n/navigation";
import { button, cn } from "@heroui/theme";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return {
    title: messages.Pages.Login.headTitle,
    description: messages.Pages.Login.metaDescription,
    keywords: messages.Pages.Login.keywords,
  };
};
const LoginPage = async () => {
  await new Promise((res) => setTimeout(res, 1000));

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
