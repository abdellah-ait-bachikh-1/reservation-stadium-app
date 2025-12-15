import { useTranslations } from 'next-intl';
import React from 'react'
import { FaSearch } from 'react-icons/fa'

const StadiumSearchFilters = ({locale}:{locale:string}) => {
     const t = useTranslations("Pages.Stadiums");
      const isRTL = locale === "ar";
    
  return (
    <div className="mb-12">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("search.placeholder")}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400">
                    <option value="">{t("filter.sport")}</option>
                    <option value="soccer">{t("sports.soccer")}</option>
                    <option value="basketball">{t("sports.basketball")}</option>
                    <option value="volleyball">{t("sports.volleyball")}</option>
                    <option value="handball">{t("sports.handball")}</option>
                  </select>
                </div>
                <div>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400">
                    <option value="">{t("filter.capacity")}</option>
                    <option value="small">{t("capacity.small")}</option>
                    <option value="medium">{t("capacity.medium")}</option>
                    <option value="large">{t("capacity.large")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
  )
}

export default StadiumSearchFilters