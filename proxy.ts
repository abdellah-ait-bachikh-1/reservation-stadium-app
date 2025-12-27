import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import db from "@/lib/db"; // استيراد Prisma client

export default async function proxy(request: NextRequest) {
  try {
    // 1. الحصول على اللغة من next-intl
    const intlMiddleware = createMiddleware(routing);
    const response = intlMiddleware(request);
    
    // 2. الحصول على اللغة الحالية من URL أو cookies
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;
    
    let currentLocale = 'ar'; // اللغة الافتراضية
    
    // استخراج اللغة من URL (مثل /ar/dashboard أو /en/dashboard)
    const localeMatch = pathname.match(/^\/(ar|en|fr)(\/|$)/);
    if (localeMatch) {
      currentLocale = localeMatch[1];
    } else {
      // أو من cookie الخاص بـ next-intl
      const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
      if (localeCookie && ['ar', 'en', 'fr'].includes(localeCookie)) {
        currentLocale = localeCookie;
      }
    }
    
    // 3. الحصول على token المستخدم من next-auth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    // 4. إذا كان المستخدم مسجلاً، تحديث preferredLocale إذا اختلفت
    if (token?.sub && currentLocale) {
      try {
        // الحصول على اللغة الحالية للمستخدم من قاعدة البيانات
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { preferredLocale: true }
        });
        
        const dbLocale = user?.preferredLocale?.toLowerCase();
        
        // إذا كانت اللغة مختلفة، قم بالتحديث
        if (dbLocale !== currentLocale) {
          console.log(`🔄 Updating user locale: ${dbLocale} → ${currentLocale}`);
          
          // تحديث preferredLocale في قاعدة البيانات
          await db.user.update({
            where: { id: token.sub },
            data: {
              preferredLocale: currentLocale.toUpperCase() as any, // 'ar' → 'AR'
            },
          });
          
          console.log(`✅ User ${token.sub} locale updated to ${currentLocale.toUpperCase()}`);
        }
      } catch (dbError) {
        console.error('❌ Error updating user locale:', dbError);
        // لا توقف التنفيذ إذا فشل تحديث اللغة
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ Middleware error:', error);
    // استمر حتى إذا حدث خطأ
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|google67d21b491c3331ec.html|.*\\..*).*)",

};