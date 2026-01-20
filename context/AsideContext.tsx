"use client"
import { createContext, useContext, useState, useCallback } from "react"

type AsideContextType = {
  isAsideOpen: boolean
  toggleAside: () => void
  openAside: () => void
  closeAside: () => void
}

const AsideContext = createContext<AsideContextType | undefined>(undefined)

export default function AsideContextProvider({ 
  children 
}: { 
  children: Readonly<React.ReactNode> 
}) {
  const [isAsideOpen, setIsAsideOpen] = useState(false)

  const toggleAside = useCallback(() => {
    setIsAsideOpen(prev => !prev)
  }, [])

  const openAside = useCallback(() => {
    setIsAsideOpen(true)
  }, [])

  const closeAside = useCallback(() => {
    setIsAsideOpen(false)
  }, [])

  return (
    <AsideContext.Provider 
      value={{ 
        isAsideOpen, 
        toggleAside, 
        openAside, 
        closeAside 
      }}
    >
      {children}
    </AsideContext.Provider>
  )
}

export const useAsideContext = (): AsideContextType => {
  const context = useContext(AsideContext)
  
  if (context === undefined) {
    throw new Error('useAsideContext must be used within an AsideContextProvider')
  }
  
  return context
}