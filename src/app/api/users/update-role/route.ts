import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json()
    await auth.setCustomUserClaims(uid, { role })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
  }
}

