import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.json()
  
  if (body.username === process.env.ADMIN_USERNAME && 
      body.password === process.env.ADMIN_PASSWORD) {
    const token = await encrypt({ username: body.username })
    ;(await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false }, { status: 401 })
}

