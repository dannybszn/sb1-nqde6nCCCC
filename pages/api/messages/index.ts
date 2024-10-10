import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '@/lib/db'
import { Message } from '@/models/Message'
import { User } from '@/models/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    await connectToDatabase()

    const { recipientId, content } = req.body
    const senderId = decoded.userId

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    })

    await newMessage.save()

    // Update or create conversation for both users
    await User.findByIdAndUpdate(senderId, { $addToSet: { conversations: recipientId } })
    await User.findByIdAndUpdate(recipientId, { $addToSet: { conversations: senderId } })

    res.status(201).json(newMessage)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}