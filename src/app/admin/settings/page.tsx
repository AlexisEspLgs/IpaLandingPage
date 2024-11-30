'use client'

import { useAppContext } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'

export default function Settings() {
  const {
    siteName,
    setSiteName,
    maintenanceMode,
    setMaintenanceMode,
    emailNotifications,
    setEmailNotifications
  } = useAppContext()

  const [message, setMessage] = useState('')

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log('Saving settings:', { siteName, maintenanceMode, emailNotifications })
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
            <Label htmlFor="email-notifications">Email Notifications</Label>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave}>Save Settings</Button>
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

