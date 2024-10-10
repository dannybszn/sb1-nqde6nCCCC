import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/db'
import { Message } from '@/models/Message'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    await connectToDatabase()

    const { conversationId } = req.query
    const userId = decoded.userId

    if (req.method === 'GET') {
      const messages = await Message.find({
        $or: [
          { sender: userId, recipient: conversationId },
          { sender: conversationId, recipient: userId }
        ]
      }).sort({ timestamp: 1 })

      res.status(200).json(messages)
    } else {
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token' })
  }
}