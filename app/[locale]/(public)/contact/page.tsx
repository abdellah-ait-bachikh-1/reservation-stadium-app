
import ContactClientPage from '@/components/public/contact/ContactClientPage';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const messages = (await import(`../../../../messages/${locale}.json`))
    .default;

  return {
    title: `${messages.pages?.contact?.metadata?.title || "Contactez-nous"}`,
    description:
      messages.pages?.contact?.metadata?.description ||
     "Contactez notre équipe pour les réservations de stades, le support ou les demandes concernant les installations sportives à Tantan, Maroc. Contactez-nous pour assistance à la réservation et opportunités de partenariat.",
    keywords:
      messages.pages?.contact?.metadata?.keywords ||
      "contact stades Tantan, support réservation stade, demandes d'installations sportives Tan-Tan, service client réservation stade, opportunités de partenariat Tantan, assistance réservation Maroc",
  };
}
const ContactPage = () => {
  return (
    <ContactClientPage/>
  )
}

export default ContactPage