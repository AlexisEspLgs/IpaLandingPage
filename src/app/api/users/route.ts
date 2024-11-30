import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const listUsersResult = await auth.listUsers()
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: user.customClaims?.role || 'user',
    }))
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
  }
}

