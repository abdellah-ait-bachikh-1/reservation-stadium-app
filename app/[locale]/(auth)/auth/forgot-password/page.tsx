import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import RegisterForm from "@/components/auth/RegisterForm";
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
    title: messages.Pages.ForgotPassword.headTitle,
    description: messages.Pages.ForgotPassword.metaDescription,
    keywords: messages.Pages.ForgotPassword.keywords,
  };
};
const ForgotPasswordPage = async () => {
  await new Promise((res) => setTimeout(res, 1000));

  return (
    <div className="w-screen flex items-center justify-center text-black dark:text-white  px-2 lg:px-0 py-2 lg:py-0">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
