import { headers } from "next/headers";
import { TLocale } from "../types";

// Helper to map database NotificationType to component type
 export function mapNotificationType(dbType: string): "account" | "reservation" | "payment" | "system" | "email" | "club" {
  if (dbType.startsWith('ACCOUNT_') || dbType === 'PROFILE_UPDATED' || dbType === 'PASSWORD_CHANGED') {
    return 'account';
  } else if (dbType.startsWith('RESERVATION_')) {
    return 'reservation';
  } else if (dbType.startsWith('PAYMENT_')) {
    return 'payment';
  } else if (dbType.startsWith('SYSTEM_') || dbType === 'NEW_FEATURE' || dbType === 'ANNOUNCEMENT') {
    return 'system';
  } else if (dbType.startsWith('EMAIL_')) {
    return 'email';
  } else if (dbType.startsWith('CLUB_')) {
    return 'club';
  } else {
    return 'system'; // default
  }
}

export function formatTimeAgo(date: Date, locale: TLocale): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // للغة الإنجليزية (الافتراضي)
  if (locale === 'en') {
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      const hours = diffInHours === 1 ? 'hour' : 'hours';
      return `${diffInHours} ${hours} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      const days = diffInDays === 1 ? 'day' : 'days';
      return `${diffInDays} ${days} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      const weeks = diffInWeeks === 1 ? 'week' : 'weeks';
      return `${diffInWeeks} ${weeks} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    const months = diffInMonths === 1 ? 'month' : 'months';
    return `${diffInMonths} ${months} ago`;
  }
  
  // للغة العربية
  if (locale === 'ar') {
    if (diffInSeconds < 60) {
      return 'الآن';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `قبل ${diffInMinutes} دقيقة`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `قبل ${diffInHours} ساعة`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `قبل ${diffInDays} يوم`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `قبل ${diffInWeeks} أسبوع`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `قبل ${diffInMonths} شهر`;
  }
  
  // للغة الفرنسية
  if (locale === 'fr') {
    if (diffInSeconds < 60) {
      return 'à l\'instant';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      const heures = diffInHours === 1 ? 'heure' : 'heures';
      return `il y a ${diffInHours} ${heures}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      const jours = diffInDays === 1 ? 'jour' : 'jours';
      return `il y a ${diffInDays} ${jours}`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      const semaines = diffInWeeks === 1 ? 'semaine' : 'semaines';
      return `il y a ${diffInWeeks} ${semaines}`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    const mois = diffInMonths === 1 ? 'mois' : 'mois';
    return `il y a ${diffInMonths} ${mois}`;
  }
  
  return 'just now';
}

// Helper function to get icon based on notification type
 export function getIconForType(type: string): React.ReactNode {
  const colorMap: Record<string, { color: string, symbol: string }> = {
    ACCOUNT: { color: 'blue', symbol: 'A' },
    RESERVATION: { color: 'green', symbol: 'R' },
    PAYMENT: { color: 'purple', symbol: 'P' },
    SYSTEM: { color: 'gray', symbol: 'S' },
    EMAIL: { color: 'amber', symbol: '✉' },
    CLUB: { color: 'indigo', symbol: 'C' },
  };

  const baseType = type.split('_')[0];
  const { color, symbol } = colorMap[baseType] || { color: 'gray', symbol: 'N' };
  
  // Return a simple div with colored background
  return (
    <div className={`w-8 h-8 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
      <span className={`text-${color}-600 dark:text-${color}-400 font-bold`}>
        {symbol}
      </span>
    </div>
  );
}


export async function getRequestLocale(): Promise<TLocale> {
  const acceptLang = (await  headers()).get('accept-language') || 'en';

  if (acceptLang.startsWith('fr')) return 'fr';
  if (acceptLang.startsWith('ar')) return 'ar';
  return 'en';
}
export function getLocalizedText<
  T extends {
    titleEn?: string | null;
    titleFr?: string | null;
    titleAr?: string | null;
    messageEn?: string | null;
    messageFr?: string | null;
    messageAr?: string | null;
  }
>(notification: T, locale: TLocale) {
  // التحقق من وجود جميع الحقول
  const titleEn = notification.titleEn || '';
  const titleFr = notification.titleFr || titleEn;
  const titleAr = notification.titleAr || titleEn;
  const messageEn = notification.messageEn || '';
  const messageFr = notification.messageFr || messageEn;
  const messageAr = notification.messageAr || messageEn;

  switch (locale) {
    case 'fr':
      return {
        title: titleFr,
        message: messageFr,
      };
    case 'ar':
      return {
        title: titleAr,
        message: messageAr,
      };
    default: // en
      return {
        title: titleEn,
        message: messageEn,
      };
  }
}



export function getActorName(
  actor: { fullNameFr?: string | null; fullNameAr?: string | null } | null,
  locale: TLocale
) {
  if (!actor) return null;
  return locale === 'ar' ? actor.fullNameAr : actor.fullNameFr;
}