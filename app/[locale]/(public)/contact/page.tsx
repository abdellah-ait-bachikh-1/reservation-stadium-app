import { locales } from '@/const';
import { getTypedGlobalTranslations } from '@/utils/i18n';
import { Metadata } from 'next';
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTypedGlobalTranslations();
 
  return {
    title: `${t("pages.contact.metadata.title")}`,
    description: t("pages.contact.metadata.description"),
    keywords: t("pages.contact.metadata.keywords"),
  };
}
const ContactPage = () => {
  return (
    <div>ContactPage</div>
  )
}

export default ContactPage