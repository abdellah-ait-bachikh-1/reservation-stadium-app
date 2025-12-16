import RegisterForm from "@/components/RegisterForm";
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
    title: messages.Pages.Register.headTitle,
    description: messages.Pages.Register.metaDescription,
    keywords: messages.Pages.Register.keywords,
  };
};
const ReisterPage = async () => {
  await new Promise((res) => setTimeout(res, 10000));
  return (
    <div className="w-screen flex items-center justify-center text-black dark:text-white  px-2 lg:px-0 py-2 lg:py-0">
      <RegisterForm />
    </div>
  );
};

export default ReisterPage;
