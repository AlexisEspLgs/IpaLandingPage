import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { idToken } = await request.json()

  try {
    const expiresIn = 60 * 60 * 24 * 1000 // 1 día en milisegundos
    // Verifica el token de ID y crea una cookie de sesión
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    // Configura la cookie de sesión

    // Asegúrate de esperar a que cookies() se resuelva
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
