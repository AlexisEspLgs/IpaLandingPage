import type { Types } from "mongoose"

export interface Activity {
  _id: Types.ObjectId
  userId: string
  userEmail: string
  action: string
  entityType?: string
  entityId?: string
  details?: string
  timestamp: Date
}

export interface FormattedActivity {
  id: string
  user: string
  action: string
  time: string
  details?: string
  entityType?: string
  entityId?: string
  actionType: string
}

