'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageList from '@/components/MessageList';
import MessageView from '@/components/MessageView';
import MessageInput from '@/components/MessageInput';
import CreateConversationButton from '@/components/CreateConversationButton';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/account/login');
      return;
    }

    // Fetch user data
    fetch('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setCurrentUserId(data._id);
      // Fetch conversations
      return fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    })
    .then(res => res.json())
    .then(data => setConversations(data))
    .catch(error => console.error('Error:', error));
  }, [router]);

  useEffect(() => {
    if (selectedConversation) {
      const token = localStorage.getItem('token');
      fetch(`/api/messages/${selectedConversation}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error:', error));
    }
  }, [selectedConversation]);

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedConversation,
          content: message,
        }),
      });

      if (response.ok) {
        // Refresh messages
        const updatedMessages = await fetch(`/api/messages/${selectedConversation}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(res => res.json());
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateConversation = (recipientId: string) => {
    setSelectedConversation(recipientId);
    // You might want to add the new conversation to the conversations list here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <CreateConversationButton onCreateConversation={handleCreateConversation} />
          <MessageList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className="w-full md:w-2/3">
          {selectedConversation ? (
            <>
              <MessageView messages={messages} currentUserId={currentUserId!} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <p>Select a conversation to start messaging</p>
          )}
        </div>
      </div>
    </div>
  );
}