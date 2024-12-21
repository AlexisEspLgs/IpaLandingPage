'use client'

import { useAppContext } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function Settings() {
  const {
    siteName,
    setSiteName,
    maintenanceMode,
    setMaintenanceMode,
    emailNotifications,
    setEmailNotifications,
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor
  } = useAppContext()

  const [message, setMessage] = useState('')

  const handleSave = () => {
    console.log('Saving settings:', { siteName, maintenanceMode, emailNotifications, theme, primaryColor })
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`space-y-6 p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-3xl font-bold">System Settings</h1>
      <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Site Name</Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
            <Label htmlFor="maintenance-mode" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Maintenance Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <Label htmlFor="email-notifications" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Email Notifications</Label>
          </div>
        </CardContent>
      </Card>
      <Card className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button onClick={toggleTheme} variant="outline" className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="ml-2">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-color" className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className={`flex-grow ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave} className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}>Save Settings</Button>
      {message && (
        <Alert className={theme === 'dark' ? 'bg-green-800 text-white' : 'bg-green-100 text-green-800'}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

