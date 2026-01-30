// components/dashboard/home/RevenueStatsGrid.tsx
"use client";

import { Card, CardBody } from "@heroui/card";
import { HiCurrencyDollar, HiChartBar, HiReceiptRefund, HiClock, HiCheckCircle } from "react-icons/hi";
import { useTypedTranslations } from "@/utils/i18n";
import { HiExclamationTriangle } from "react-icons/hi2";

interface RevenueStatsGridProps {
  stats: {
    totalRevenueThisYear: number;
    subscriptionRevenueThisYear: number;
    singleSessionRevenueThisYear: number;
    totalPaidThisYear: number;
    totalPendingThisYear: number;
    totalOverdueThisYear: number;
    collectionRateThisYear: number;
    monthlyTotalRevenue: number;
    monthlySubscriptionRevenue: number;
    monthlySingleSessionRevenue: number;
    monthlyPaidAmount: number;
    monthlyCollectionRate: number;
    vsLastYearTotalRevenue: string;
    changes?: {
      totalRevenueChange?: string;
      subscriptionRevenueChange?: string;
      singleSessionRevenueChange?: string;
      collectionRateChange?: string;
    };
  };
  currentYear: number;
}

export default function RevenueStatsGrid({ stats, currentYear }: RevenueStatsGridProps) {
  const t = useTypedTranslations();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const revenueCards = [
    {
      id: 'total-revenue',
      title: t('pages.dashboard.home.stats.totalRevenue.title'),
      description: t('pages.dashboard.home.stats.totalRevenue.description', { year: currentYear }),
      value: formatCurrency(stats.totalRevenueThisYear),
      change: stats.changes?.totalRevenueChange,
      icon: <HiCurrencyDollar className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      breakdown: [
        { label: t('pages.dashboard.home.revenueTrends.subscriptionAnnual'), value: formatCurrency(stats.subscriptionRevenueThisYear) },
        { label: t('pages.dashboard.home.revenueTrends.singleSessionAnnual'), value: formatCurrency(stats.singleSessionRevenueThisYear) },
      ],
    },
    {
      id: 'payment-status',
      title: t('pages.dashboard.home.stats.paymentStatus.title'),
      description: t('pages.dashboard.home.stats.paymentStatus.description'),
      value: formatCurrency(stats.totalPaidThisYear),
      icon: <HiCheckCircle className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      breakdown: [
        { 
          label: t('pages.dashboard.home.revenueTrends.paidAnnual'), 
          value: formatCurrency(stats.totalPaidThisYear),
          color: 'text-green-600 dark:text-green-400'
        },
        { 
          label: t('pages.dashboard.home.revenueTrends.overdueAnnual'), 
          value: formatCurrency(stats.totalOverdueThisYear),
          color: 'text-red-600 dark:text-red-400'
        },
        { 
          label: t('pages.dashboard.home.revenueTrends.enAttente'), 
          value: formatCurrency(stats.totalPendingThisYear),
          color: 'text-yellow-600 dark:text-yellow-400'
        },
      ],
    },
    {
      id: 'collection-rate',
      title: t('pages.dashboard.home.stats.collectionRate.title'),
      description: t('pages.dashboard.home.stats.collectionRate.description'),
      value: `${stats.collectionRateThisYear}%`,
      change: stats.changes?.collectionRateChange,
      icon: <HiChartBar className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      subtext: t('pages.dashboard.home.revenueTrends.collectionRate'),
      calculation: `${formatCurrency(stats.totalPaidThisYear)} / ${formatCurrency(stats.totalRevenueThisYear)}`,
    },
    {
      id: 'monthly-revenue',
      title: t('pages.dashboard.home.stats.monthlyRevenue.title'),
      description: t('pages.dashboard.home.stats.monthlyRevenue.description'),
      value: formatCurrency(stats.monthlyTotalRevenue),
      icon: <HiReceiptRefund className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      breakdown: [
        { label: t('pages.dashboard.home.revenueTrends.monthlySubscription'), value: formatCurrency(stats.monthlySubscriptionRevenue) },
        { label: t('pages.dashboard.home.revenueTrends.monthlySingleSession'), value: formatCurrency(stats.monthlySingleSessionRevenue) },
      ],
      subtext: `${t('pages.dashboard.home.revenueTrends.collectionRate')}: ${stats.monthlyCollectionRate}%`,
    },
    {
      id: 'overdue-alert',
      title: t('pages.dashboard.home.stats.overduePayments.title'),
      description: t('pages.dashboard.home.stats.overduePayments.description'),
      value: formatCurrency(stats.totalOverdueThisYear),
      icon: <HiExclamationTriangle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      alert: true,
      breakdown: [
        { 
          label: t('pages.dashboard.home.overduePayments.overdue'), 
          value: formatCurrency(stats.totalOverdueThisYear),
          color: 'text-red-600 dark:text-red-400'
        },
      ],
    },
    {
      id: 'pending-revenue',
      title: t('pages.dashboard.home.stats.pendingRevenue.title'),
      description: t('pages.dashboard.home.stats.pendingRevenue.description'),
      value: formatCurrency(stats.totalPendingThisYear),
      icon: <HiClock className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      breakdown: [
        { 
          label: t('pages.dashboard.home.revenueTrends.enAttente'), 
          value: formatCurrency(stats.totalPendingThisYear),
          color: 'text-yellow-600 dark:text-yellow-400'
        },
      ],
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('pages.dashboard.home.revenueTrends.title')} - {currentYear}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('pages.dashboard.home.revenueTrends.description')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {revenueCards.map((card) => (
          <Card 
            key={card.id}
            className={`${card.color} ${card.borderColor} border`}
          >
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {card.icon}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
                {card.change && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.change.startsWith('+') 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {card.change}
                  </span>
                )}
              </div>

              <div className="mb-3">
                <div className={`text-2xl font-bold ${card.alert ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {card.value}
                </div>
                {card.subtext && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {card.subtext}
                  </div>
                )}
                {card.calculation && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('pages.dashboard.home.stats.calculation')}: {card.calculation}
                  </div>
                )}
              </div>

              {card.breakdown && card.breakdown.length > 0 && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('pages.dashboard.home.stats.breakdown')}:
                  </div>
                  <div className="space-y-1">
                    {card.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {item.label}
                        </span>
                        <span className={`text-xs font-medium ${item.color || 'text-gray-900 dark:text-white'}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.alert && (
                <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                  {t('pages.dashboard.home.stats.requiresAttention')}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Revenue Explanation Section */}
      <Card className="mt-6 bg-gray-50 dark:bg-zinc-800">
        <CardBody className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('pages.dashboard.home.revenueTrends.howCalculated')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('pages.dashboard.home.revenueTrends.revenueTypes')}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>
                    <strong>{t('pages.dashboard.home.revenueTrends.subscriptionAnnual')}:</strong> 
                    {t('pages.dashboard.home.revenueTrends.subscriptionExplanation')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>
                    <strong>{t('pages.dashboard.home.revenueTrends.singleSessionAnnual')}:</strong> 
                    {t('pages.dashboard.home.revenueTrends.singleSessionExplanation')}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {t('pages.dashboard.home.revenueTrends.paymentStatus')}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">●</span>
                  <span>
                    <strong>{t('pages.dashboard.home.revenueTrends.paid')}:</strong> 
                    {t('pages.dashboard.home.revenueTrends.paidExplanation')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400">●</span>
                  <span>
                    <strong>{t('pages.dashboard.home.revenueTrends.enAttente')}:</strong> 
                    {t('pages.dashboard.home.revenueTrends.pendingExplanation')}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400">●</span>
                  <span>
                    <strong>{t('pages.dashboard.home.revenueTrends.overdue')}:</strong> 
                    {t('pages.dashboard.home.revenueTrends.overdueExplanation')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}