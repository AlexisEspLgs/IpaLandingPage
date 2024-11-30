import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const listUsersResult = await auth.listUsers()
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const totalUsers = listUsersResult.users.length
    const activeUsers = listUsersResult.users.filter(user => user.metadata.lastSignInTime).length
    const newUsersThisMonth = listUsersResult.users.filter(user => {
      const creationTime = new Date(user.metadata.creationTime)
      return creationTime >= oneMonthAgo
    }).length

    return NextResponse.json({
      totalUsers,
      activeUsers,
      newUsersThisMonth
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch user statistics' }, { status: 500 })
  }
}

