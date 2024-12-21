'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AppContextType {
 siteName: string
 setSiteName: (name: string) => void
 maintenanceMode: boolean
 setMaintenanceMode: (mode: boolean) => void
 emailNotifications: boolean
 setEmailNotifications: (enabled: boolean) => void
 theme: 'light' | 'dark'
 setTheme: (theme: 'light' | 'dark') => void
 primaryColor: string
 setPrimaryColor: (color: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
 const [siteName, setSiteName] = useState('My Admin Panel')
 const [maintenanceMode, setMaintenanceMode] = useState(false)
 const [emailNotifications, setEmailNotifications] = useState(true)
 const [theme, setTheme] = useState<'light' | 'dark'>('light')
 const [primaryColor, setPrimaryColor] = useState('#1E40AF') // Azul rey

 useEffect(() => {
   const savedTheme = localStorage.getItem('theme')
   if (savedTheme) {
     setTheme(savedTheme as 'light' | 'dark')
   }
 }, [])

 useEffect(() => {
   const root = window.document.documentElement;
   root.classList.remove('light', 'dark')
   root.classList.add(theme)
   localStorage.setItem('theme', theme)
 }, [theme])

 useEffect(() => {
   const root = window.document.documentElement;
   root.style.setProperty('--primary', primaryColor);
 }, [primaryColor])

 return (
   <AppContext.Provider
     value={{
       siteName,
       setSiteName,
       maintenanceMode,
       setMaintenanceMode,
       emailNotifications,
       setEmailNotifications,
       theme,
       setTheme,
       primaryColor,
       setPrimaryColor,
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

