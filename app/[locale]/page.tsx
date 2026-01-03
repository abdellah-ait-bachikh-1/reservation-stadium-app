import { getTranslations } from 'next-intl/server'
import React from 'react'

const HomePage = async () => {
  const t = await getTranslations("pages.home")
  return (
    <div> {t('title')} </div>
  )
}

export default HomePage