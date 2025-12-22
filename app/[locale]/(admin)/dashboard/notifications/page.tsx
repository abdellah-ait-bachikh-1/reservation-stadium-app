"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Divider } from "@heroui/divider";
import { HiBell, HiPaperAirplane, HiUser } from "react-icons/hi";
import { sendTestNotification } from "@/app/actions/test-notifications";

export default function NotificationsTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [notificationType, setNotificationType] = useState("reservation");
  const [customMessage, setCustomMessage] = useState("");
  
  // ID المستلم الثابت
  const receiverId = "8c214c0d-c61c-4361-8f32-2d71a6461ebe";

  // أنواع الإشعارات
  const notificationTypes = [
    { key: "reservation", label: "طلب حجز جديد" },
    { key: "payment", label: "دفع جديد" },
    { key: "club", label: "تسجيل نادي" },
    { key: "system", label: "إعلان النظام" },
    { key: "account", label: "تحديث الحساب" },
  ];

  const handleSendTestNotification = async () => {
    try {
      setIsLoading(true);
      setResult(null);

      const result = await sendTestNotification({
        receiverId,
        type: notificationType,
        customMessage: customMessage || undefined,
      });

      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "حدث خطأ غير معروف",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <HiBell className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            اختبار الإشعارات الفورية
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            صفحة لاختبار نظام الإشعارات الفورية باستخدام Pusher
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات المستخدم */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <HiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">معلومات الإرسال</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                المرسل: أنت (المستخدم الحالي)
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  المستلم الثابت:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1 break-all">
                  {receiverId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  ⚠️ هذا ID ثابت للإختبار فقط
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  تفاصيل الاتصال:
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  • Pusher متصل: سيظهر في Console
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  • الإشعارات: تظهر فوراً في الجرس
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  • الصوت: يتم تشغيله عند الاستلام
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* نموذج الإرسال */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              إرسال إشعار اختباري
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              اختر نوع الإشعار وأرسله للمستخدم الثابت
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* نوع الإشعار */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع الإشعار
                </label>
                <Select
                  label="اختر نوع الإشعار"
                  selectedKeys={[notificationType]}
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="max-w-full"
                >
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* رسالة مخصصة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رسالة مخصصة (اختياري)
                </label>
                <Input
                  placeholder="أدخل رسالة مخصصة للإشعار..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  إذا تركتها فارغة، سيتم استخدام رسالة افتراضية
                </p>
              </div>

              <Divider />

              {/* معاينة الإشعار */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  معاينة الإشعار
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {notificationType === "reservation" ? "R" : 
                         notificationType === "payment" ? "$" : 
                         notificationType === "club" ? "C" : 
                         notificationType === "system" ? "⚙" : "A"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {notificationType === "reservation" ? "طلب حجز جديد" :
                         notificationType === "payment" ? "دفع جديد" :
                         notificationType === "club" ? "تسجيل نادي جديد" :
                         notificationType === "system" ? "إعلان النظام" :
                         "تحديث الحساب"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {customMessage || 
                          (notificationType === "reservation" ? "طلب حجز جديد للملعب رقم 5" :
                           notificationType === "payment" ? "تم استلام دفعة بقيمة 500 درهم" :
                           notificationType === "club" ? "تم تسجيل نادي جديد في النظام" :
                           notificationType === "system" ? "تم إصدار تحديث جديد للنظام" :
                           "تم تحديث معلومات حسابك بنجاح")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* نتيجة الإرسال */}
              {result && (
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}>
                  <p className={`font-medium ${
                    result.success 
                      ? "text-green-800 dark:text-green-300" 
                      : "text-red-800 dark:text-red-300"
                  }`}>
                    {result.success ? "✅ تم الإرسال بنجاح" : "❌ فشل الإرسال"}
                  </p>
                  <p className={`text-sm mt-1 ${
                    result.success 
                      ? "text-green-700 dark:text-green-400" 
                      : "text-red-700 dark:text-red-400"
                  }`}>
                    {result.message}
                  </p>
                </div>
              )}

              {/* زر الإرسال */}
              <Button
                color="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                onPress={handleSendTestNotification}
                startContent={<HiPaperAirplane className="w-5 h-5" />}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال إشعار اختباري"}
              </Button>

              {/* تعليمات */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  ⚠️ تعليمات الاختبار
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• افتح Console (F12) لمشاهدة تفاصيل الاتصال</li>
                  <li>• تأكد من فتح قائمة الإشعارات (الجرس) للمستلم</li>
                  <li>• استمع إلى صوت الإشعار عند الاستلام</li>
                  <li>• تحقق من Dashboard Pusher لمشاهدة الأحداث</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* لوحة معلومات Pusher */}
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            معلومات تقنية - Pusher
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">App ID</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
                {process.env.PUSHER_APP_ID ? "****" : "غير مضبوط"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
                {process.env.NEXT_PUBLIC_PUSHER_KEY?.substring(0, 10)}...
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cluster</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">
                {process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu"}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              variant="flat"
              size="sm"
              onPress={() => {
                console.log("🔍 Debug Info:", {
                  pusherKey: process.env.NEXT_PUBLIC_PUSHER_KEY,
                  pusherCluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                  receiverId,
                  currentTime: new Date().toISOString()
                });
                alert("تم تسجيل معلومات التصحيح في Console");
              }}
            >
              عرض معلومات التصحيح في Console
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}