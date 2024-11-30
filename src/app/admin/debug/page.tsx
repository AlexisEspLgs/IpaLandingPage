'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function DebugPage() {
  const [config, setConfig] = useState<unknown>(null)
  const [authStatus, setAuthStatus] = useState<string>('Checking...')

  useEffect(() => {
    // Check Firebase config
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }
    setConfig(firebaseConfig)

    // Check auth status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(`Logged in as ${user.email}`)
      } else {
        setAuthStatus('Not logged in')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Debug Page</h1>
      <h2 className="text-xl font-semibold mb-2">Firebase Config:</h2>
      <pre className="bg-gray-100 p-2 rounded mb-4">
        {JSON.stringify(config, null, 2)}
      </pre>
      <h2 className="text-xl font-semibold mb-2">Auth Status:</h2>
      <p>{authStatus}</p>
    </div>
  )
}

