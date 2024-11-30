import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()
    const userRecord = await auth.createUser({
      email,
      password,
    })
    await auth.setCustomUserClaims(userRecord.uid, { role })
    return NextResponse.json({ success: true, uid: userRecord.uid })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

