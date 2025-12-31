// components/FAQAccordion.tsx
"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { useTranslations } from "next-intl";

export default function FAQAccordion() {
  const t = useTranslations("Pages.Contact");

  // Get FAQ questions from translations
  const faqItems = [
    {
      key: "1",
      questionKey: "faq.questions.0.question",
      answerKey: "faq.questions.0.answer",
    },
    {
      key: "2",
      questionKey: "faq.questions.1.question",
      answerKey: "faq.questions.1.answer",
    },
    {
      key: "3",
      questionKey: "faq.questions.2.question",
      answerKey: "faq.questions.2.answer",
    },
    {
      key: "4",
      questionKey: "faq.questions.3.question",
      answerKey: "faq.questions.3.answer",
    },
  ];

  return (
    <Accordion variant="splitted" className="px-0">
      {faqItems.map((item) => (
        <AccordionItem
          key={item.key}
          title={t(item.questionKey)}
          classNames={{
            title: "font-medium text-gray-900 dark:text-white",
            content: "text-gray-600 dark:text-gray-400",
            base: "dark:bg-slate-900",
          }}
        >
          {t(item.answerKey)}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
