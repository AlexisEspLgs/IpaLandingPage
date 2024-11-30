import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'
const key = new TextEncoder().encode(secretKey)

interface UserPayload {
  username: string;
  [key: string]: string | number | boolean; // This line adds the index signature
}

export async function encrypt(payload: UserPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload as UserPayload
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = await cookieStore.get('token')
  if (!token) return null
  return await decrypt(token.value)
}

export async function updateSession(request: NextRequest): Promise<UserPayload | null> {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  return await decrypt(token)
}

