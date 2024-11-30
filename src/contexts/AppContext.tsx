'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AppContextType {
  siteName: string
  setSiteName: (name: string) => void
  maintenanceMode: boolean
  setMaintenanceMode: (mode: boolean) => void
  emailNotifications: boolean
  setEmailNotifications: (enabled: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [siteName, setSiteName] = useState('My Admin Panel')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    // Here you would typically load these settings from your backend or local storage
    // For now, we'll just use default values
  }, [])

  return (
    <AppContext.Provider
      value={{
        siteName,
        setSiteName,
        maintenanceMode,
        setMaintenanceMode,
        emailNotifications,
        setEmailNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

