"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/actions/auth/verify-email";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  MailCheck,
  ShieldCheck,
  AlertCircle,
  Clock,
  Mail,
  UserCheck,
  Phone,
  Users,
  Shield
} from "lucide-react";
import { useTypedTranslations } from "@/utils/i18n";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const locale = useLocale();
  const t = useTypedTranslations();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    const verify = async () => {
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

    verify();
  }, [token, router, locale, t]);

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

  // Success state - NO AUTO-REDIRECT
  return (
    <div className="flex items-center justify-center p-4 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {t("pages.auth.emailVerification.success.title")}
          </h1>
          
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">
              {t("pages.auth.emailVerification.success.message")}
            </p>
            <div className="flex items-center justify-center space-x-3 p-3 bg-green-50 rounded-lg mb-4">
              <MailCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                {t("pages.auth.emailVerification.success.emailConfirmed")}
              </span>
            </div>
          </div>
          
          {/* Admin Approval Process Card */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">
                  {t("pages.auth.emailVerification.success.adminReviewTitle")}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">
                        {t("pages.auth.emailVerification.success.waitForReview")}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {t("pages.auth.emailVerification.success.reviewTimeInfo")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">
                        {t("pages.auth.emailVerification.success.adminWillCall")}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {t("pages.auth.emailVerification.success.callVerificationInfo")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700 mb-1">
                        {t("pages.auth.emailVerification.success.securityCheck")}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {t("pages.auth.emailVerification.success.manualVerificationInfo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* What happens next */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("pages.auth.emailVerification.success.nextStepsTitle")}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <span className="text-sm text-gray-700 text-left">
                  {t("pages.auth.emailVerification.success.steps.adminReview")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <span className="text-sm text-gray-700 text-left">
                  {t("pages.auth.emailVerification.success.steps.adminCall")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <span className="text-sm text-gray-700 text-left">
                  {t("pages.auth.emailVerification.success.steps.approvalEmail")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <span className="text-sm text-gray-700 text-left">
                  {t("pages.auth.emailVerification.success.steps.fullAccess")}
                </span>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                {t("pages.auth.emailVerification.success.keepPhoneReady")}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              hrefLang={locale}
              className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t("pages.auth.emailVerification.success.goToHomepage")}
            </Link>
            
            <Link
              href="/contact"
              hrefLang={locale}
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {t("pages.auth.emailVerification.success.contactSupport")}
            </Link>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {t("pages.auth.emailVerification.success.thankYouMessage")}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t("pages.auth.emailVerification.success.weWillContactYou")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;