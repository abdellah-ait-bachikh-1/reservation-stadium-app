"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaSpinner,
  FaShieldAlt,
  FaEnvelope,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaSync,
  FaRocket,
  FaLock,
  FaUserCheck,
  FaBan,
  FaUserSlash,
  FaArrowRight,
  FaKey,
  FaUser,
} from "react-icons/fa";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

type VerificationStatus =
  | "loading"
  | "verified"
  | "already_verified"
  | "invalid_token"
  | "user_not_found"
  | "user_deleted"
  | "error";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Pages.VerifyPage");
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!token) {
      setStatus("invalid_token");
      addToast({
        title: t("errors.invalidToken.title"),
        description: t("errors.invalidToken.description"),
        color: "warning",
      });
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        clearInterval(progressInterval);
        setProgress(100);

        if (!response.ok) {
          // Map API status to toast types
          let toastColor:
            | "success"
            | "danger"
            | "warning"
            | "primary"
            | "secondary"
            | "default" = "danger";
          let toastTitle = "";
          let toastDescription = "";

          switch (data.status) {
            case "user_deleted":
              toastColor = "danger";
              toastTitle = t("errors.userDeleted.title");
              toastDescription = t("errors.userDeleted.description");
              break;
            case "user_not_found":
              toastColor = "warning";
              toastTitle = t("errors.userNotFound.title");
              toastDescription = t("errors.userNotFound.description");
              break;
            case "invalid_token":
              toastColor = "warning";
              toastTitle = t("errors.invalidToken.title");
              toastDescription = t("errors.invalidToken.description");
              break;
            default:
              toastColor = "danger";
              toastTitle = t("errors.error.title");
              toastDescription = t("errors.error.description");
          }

          addToast({
            title: toastTitle,
            description: toastDescription,
            color: toastColor,
          });

          setStatus(data.status || "error");
          return;
        }

        // Success toasts
        switch (data.status) {
          case "verified":
            addToast({
              title: t("verified.title"),
              description: t("verified.description"),
              color: "success",
            });
            break;
          case "already_verified":
            addToast({
              title: t("alreadyVerified.title"),
              description: t("alreadyVerified.description"),
              color: "primary",
            });
            break;
        }

        setStatus(data.status);
      } catch (error) {
        clearInterval(progressInterval);
        setProgress(100);
        console.error("Verification error:", error);

        addToast({
          title: t("errors.error.title"),
          description: t("errors.networkError"),
          color: "danger",
        });

        setStatus("error");
      }
    };

    verifyEmail();

    return () => clearInterval(progressInterval);
  }, [token, router, t]);

  const handleLoginRedirect = () => router.push("/auth/login");
  const handleHomeRedirect = () => router.push("/");
  const handleRegisterRedirect = () => router.push("/auth/register");
  const handleRetry = () => {
    setStatus("loading");
    setProgress(0);
  };
  const handleContactSupport = () => router.push("/contact");

  // Status color mapping
  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "already_verified":
        return "text-blue-600";
      case "loading":
        return "text-blue-600";
      case "user_deleted":
        return "text-red-600";
      case "user_not_found":
      case "invalid_token":
      case "error":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 dark:bg-green-900/20";
      case "already_verified":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "loading":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "user_deleted":
        return "bg-red-100 dark:bg-red-900/20";
      case "user_not_found":
      case "invalid_token":
      case "error":
        return "bg-amber-100 dark:bg-amber-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    const iconClass =
      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6";

    switch (status) {
      case "loading":
        return (
          <div className={`${iconClass} ${getStatusBgColor(status)}`}>
            <FaEnvelope className="text-blue-600 text-3xl" />
          </div>
        );
      case "verified":
        return (
          <div className={`${iconClass} ${getStatusBgColor(status)}`}>
            <FaCheckCircle className="text-green-600 text-3xl" />
          </div>
        );
      case "already_verified":
        return (
          <div className={`${iconClass} ${getStatusBgColor(status)}`}>
            <FaUserCheck className="text-blue-600 text-3xl" />
          </div>
        );
      case "user_deleted":
        return (
          <div className={`${iconClass} ${getStatusBgColor(status)}`}>
            <FaUserSlash className="text-red-600 text-3xl" />
          </div>
        );
      default:
        return (
          <div className={`${iconClass} ${getStatusBgColor(status)}`}>
            <FaExclamationCircle className="text-amber-600 text-3xl" />
          </div>
        );
    }
  };

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center">
            {getStatusIcon(status)}

            <h1 className={`text-2xl font-bold mb-3 ${getStatusColor(status)}`}>
              {t("loading.title")}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("loading.subtitle")}
            </p>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("loading.progress")}</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-gray-500">
                <FaSpinner className="animate-spin text-blue-600" />
                <span>{t("loading.processing")}</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 text-left">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
                {t("loading.whyVerification")}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("loading.reasons.security")}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaKey className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("loading.reasons.notifications")}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaLock className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("loading.reasons.enhancement")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success - Verified
  if (status === "verified") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center">
            {getStatusIcon(status)}

            <h1 className={`text-2xl font-bold mb-3 ${getStatusColor(status)}`}>
              {t("verified.title")}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("verified.description")}
            </p>

            <div className="space-y-4 mb-8">
              <Button
                color="primary"
                className="w-full py-6 text-lg font-semibold"
                onPress={handleLoginRedirect}
                startContent={<FaSignInAlt />}
                endContent={<FaArrowRight />}
              >
                {t("verified.goToLogin")}
              </Button>

              <Button
                variant="bordered"
                className="w-full py-6 text-lg"
                onPress={handleHomeRedirect}
                startContent={<FaHome />}
              >
                {t("verified.goToHomepage")}
              </Button>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <FaRocket className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">
                  {t("verified.readyToExplore")}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("verified.exploreDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Already Verified
  if (status === "already_verified") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center">
            {getStatusIcon(status)}

            <h1 className={`text-2xl font-bold mb-3 ${getStatusColor(status)}`}>
              {t("alreadyVerified.title")}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("alreadyVerified.description")}
            </p>

            <div className="space-y-4 mb-8">
              <Button
                color="primary"
                className="w-full py-6 text-lg font-semibold"
                onPress={handleLoginRedirect}
                startContent={<FaSignInAlt />}
                endContent={<FaArrowRight />}
              >
                {t("alreadyVerified.goToLogin")}
              </Button>

              <Button
                variant="bordered"
                className="w-full py-6 text-lg"
                onPress={handleHomeRedirect}
                startContent={<FaHome />}
              >
                {t("alreadyVerified.returnToHomepage")}
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <FaLock className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200">
                  {t("alreadyVerified.accountSecurity")}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("alreadyVerified.securityDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error States
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/40 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center">
          {getStatusIcon(status)}

          <h1 className={`text-2xl font-bold mb-3 ${getStatusColor(status)}`}>
            {status === "user_not_found"
              ? t("errors.userNotFound.title")
              : status === "user_deleted"
              ? t("errors.userDeleted.title")
              : status === "invalid_token"
              ? t("errors.invalidToken.title")
              : t("errors.error.title")}
          </h1>

          <div className="space-y-4 mb-8">
            {status === "user_not_found" ? (
              <>
                <Button
                  color="primary"
                  className="w-full py-6 text-lg font-semibold"
                  onPress={handleRegisterRedirect}
                  startContent={<FaUserPlus />}
                  endContent={<FaArrowRight />}
                >
                  {t("errors.userNotFound.registerNew")}
                </Button>

                <Button
                  variant="bordered"
                  className="w-full py-6 text-lg"
                  onPress={handleHomeRedirect}
                  startContent={<FaHome />}
                >
                  {t("errors.userNotFound.goToHomepage")}
                </Button>
              </>
            ) : status === "user_deleted" ? (
              <>
                <Button
                  color="danger"
                  className="w-full py-6 text-lg font-semibold"
                  onPress={handleContactSupport}
                  startContent={<FaInfoCircle />}
                >
                  {t("errors.userDeleted.contactSupport")}
                </Button>

                <Button
                  variant="bordered"
                  className="w-full py-6 text-lg"
                  onPress={handleRegisterRedirect}
                  startContent={<FaUser />}
                >
                  {t("errors.userDeleted.createNewAccount")}
                </Button>

                <Button
                  variant="light"
                  className="w-full py-6 text-lg"
                  onPress={handleHomeRedirect}
                  startContent={<FaHome />}
                >
                  {t("errors.userDeleted.returnToHomepage")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="warning"
                  className="w-full py-6 text-lg font-semibold"
                  onPress={handleRetry}
                  startContent={<FaSync />}
                >
                  {t("errors.invalidToken.tryAgain")}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="bordered"
                    className="w-full py-5"
                    onPress={handleRegisterRedirect}
                    startContent={<FaUserPlus />}
                  >
                    {t("errors.invalidToken.registerAgain")}
                  </Button>

                  <Button
                    variant="light"
                    className="w-full py-5"
                    onPress={handleHomeRedirect}
                    startContent={<FaHome />}
                  >
                    {t("errors.invalidToken.returnHome")}
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className={`rounded-xl p-5 ${getStatusBgColor(status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                <FaInfoCircle className="text-gray-600 dark:text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                {status === "user_deleted" 
                  ? "هل تحتاج إلى مساعدة؟"
                  : "ماذا حدث؟"}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {status === "user_not_found"
                ? "يرجى التسجيل لحساب جديد للمتابعة."
                : status === "user_deleted"
                ? "اتصل بفريق الدعم إذا كنت تعتقد أن هذا خطأ."
                : "حاول التسجيل مرة أخرى أو اتصل بالدعم إذا استمرت المشكلة."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;