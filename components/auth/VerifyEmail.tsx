"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/actions/auth/verify-email";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  MailCheck,
  AlertCircle,
  Clock,
  Phone,
  Users,
  Shield
} from "lucide-react";
import { useTypedTranslations } from "@/utils/i18n";
import { Button } from "@heroui/button";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const locale = useLocale();
  const t = useTypedTranslations();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  // Don't auto-verify on page load
  const handleVerify = async () => {
    if (!token) {
      router.replace("/");
      return;
    }

    setStatus("loading");

    try {
      const res = await verifyEmail(token);

      if (res.status !== 200) {
        if (res.status === 404) {
          router.replace("/");
          return;
        }

        setStatus("error");
        setMessage(res.message);

        switch (res.message) {
          case "Invalid verification token":
            setErrorDetails(t("pages.auth.emailVerification.error.invalidTokenDetails"));
            break;
          case "Email already verified":
            setMessage(t("pages.auth.emailVerification.success.message"));
            setErrorDetails(t("pages.auth.emailVerification.error.alreadyVerifiedDetails"));
            break;
          case "Verification token expired":
            setErrorDetails(t("pages.auth.emailVerification.error.expiredTokenDetails"));
            break;
          default:
            setErrorDetails(t("pages.auth.emailVerification.error.genericErrorDetails"));
        }
        return;
      }

      setMessage(t("pages.auth.emailVerification.success.message"));
      setStatus("success");

    } catch (error) {
      setStatus("error");
      setMessage(t("pages.auth.emailVerification.error.genericError"));
      setErrorDetails(t("pages.auth.emailVerification.error.genericErrorDetails"));
    }
  };

  // If no token, redirect immediately
  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-4 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6"
            >
              <Loader2 className="w-12 h-12 text-blue-500" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {t("pages.auth.emailVerification.loading.title")}
            </h2>
            <p className="text-gray-600 mb-8">
              {t("pages.auth.emailVerification.loading.message")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>{t("pages.auth.emailVerification.loading.steps.checkingToken")}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <span>{t("pages.auth.emailVerification.loading.steps.updatingAccount")}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                <span>{t("pages.auth.emailVerification.loading.steps.preparingDashboard")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="flex items-center justify-center p-4 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full"
            >
              <XCircle className="w-12 h-12 text-red-500" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {t("pages.auth.emailVerification.error.title")}
            </h2>
            <p className="text-gray-600 mb-4">
              {message}
            </p>

            {errorDetails && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 text-left">
                    {errorDetails}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Link
                href="/auth/register"
                hrefLang={locale}
                className="block w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {t("pages.auth.emailVerification.error.tryAgain")}
              </Link>

              <Link
                href="/contact"
                hrefLang={locale}
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {t("pages.auth.emailVerification.error.contactSupport")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
   <div className="flex items-center justify-center p-4 min-h-[80vh]">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-4xl"
  >
    <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-amber-500/5 p-6 md:p-8 lg:p-10 text-center border border-zinc-200 dark:border-zinc-700/50">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-6 bg-green-100 dark:bg-green-900/30 rounded-full"
      >
        <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-green-500 dark:text-green-400" />
      </motion.div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
        {t("pages.auth.emailVerification.success.title")}
      </h1>

      <div className="mb-8 md:mb-10">
        <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 mb-4 md:mb-6">
          {t("pages.auth.emailVerification.success.message")}
        </p>
        <div className="flex items-center justify-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4 max-w-md mx-auto">
          <MailCheck className="w-5 h-5 text-green-500 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {t("pages.auth.emailVerification.success.emailConfirmed")}
          </span>
        </div>
      </div>

      {/* Admin Approval Process Card */}
      <div className="mb-8 md:mb-10 p-5 md:p-6 lg:p-7 bg-blue-50 dark:bg-blue-900/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-700/50">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-3 md:mb-4">
              {t("pages.auth.emailVerification.success.adminReviewTitle")}
            </h3>

            <div className="space-y-4 md:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 mx-auto sm:mx-0" />
                <div className="text-center sm:text-left">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {t("pages.auth.emailVerification.success.waitForReview")}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400/80">
                    {t("pages.auth.emailVerification.success.reviewTimeInfo")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 mx-auto sm:mx-0" />
                <div className="text-center sm:text-left">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {t("pages.auth.emailVerification.success.adminWillCall")}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400/80">
                    {t("pages.auth.emailVerification.success.callVerificationInfo")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 mx-auto sm:mx-0" />
                <div className="text-center sm:text-left">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {t("pages.auth.emailVerification.success.securityCheck")}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400/80">
                    {t("pages.auth.emailVerification.success.manualVerificationInfo")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="mb-8 md:mb-10">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-6">
          {t("pages.auth.emailVerification.success.nextStepsTitle")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-700/30 rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                  {step}
                </span>
              </div>
              <span className="text-sm text-gray-700 dark:text-zinc-300 text-left flex-1">
                {t(`pages.auth.emailVerification.success.steps.${
                  step === 1 ? "adminReview" :
                  step === 2 ? "adminCall" :
                  step === 3 ? "approvalEmail" : "fullAccess"
                }`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-8 md:mb-10 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t("pages.auth.emailVerification.success.keepPhoneReady")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Link
          href="/"
          hrefLang={locale}
          className="block w-full py-3 px-4 md:py-4 md:px-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          {t("pages.auth.emailVerification.success.goToHomepage")}
        </Link>

        <Link
          href="/contact"
          hrefLang={locale}
          className="block w-full py-3 px-4 md:py-4 md:px-6 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-200"
        >
          {t("pages.auth.emailVerification.success.contactSupport")}
        </Link>
      </div>

      {/* Additional Info */}
      <div className="mt-8 md:mt-10 pt-6 border-t border-gray-200 dark:border-zinc-700">
        <p className="text-sm text-gray-500 dark:text-zinc-500">
          {t("pages.auth.emailVerification.success.thankYouMessage")}
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-600 mt-2">
          {t("pages.auth.emailVerification.success.weWillContactYou")}
        </p>
      </div>
    </div>
  </motion.div>
</div>
    );
  }

  // Idle state (initial state - user needs to click verify)
  return (
   <div className="flex items-center justify-center p-4 min-h-[60vh]">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="max-w-md w-full"
  >
    <div className="bg-white dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-amber-500/5 p-8 text-center border border-zinc-200 dark:border-zinc-700/50">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full">
        <MailCheck className="w-12 h-12 text-amber-500 dark:text-amber-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        {t("pages.auth.emailVerification.ready.title")}
      </h2>
      <p className="text-gray-600 dark:text-zinc-400 mb-8">
        {t("pages.auth.emailVerification.ready.message")}
      </p>

      <Button
        onPress={handleVerify}
        color="warning"
        size="lg"
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600"
        startContent={<MailCheck className="w-5 h-5" />}
      >
        {t("pages.auth.emailVerification.ready.verifyButton")}
      </Button>

      <p className="mt-4 text-sm text-gray-500 dark:text-zinc-500">
        {t("pages.auth.emailVerification.ready.note")}
      </p>
    </div>
  </motion.div>
</div>
  );
};

export default VerifyEmail;