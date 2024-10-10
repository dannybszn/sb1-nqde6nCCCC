import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from 'date-fns';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface MessageViewProps {
  messages: Message[] | undefined;
  currentUserId: string;
}

const MessageView: React.FC<MessageViewProps> = ({ messages, currentUserId }) => {
  if (!messages) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`flex max-w-[70%] ${
              message.sender === currentUserId ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {message.sender !== currentUserId && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={`https://i.pravatar.cc/32?u=${message.sender}`} />
                <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 ${
                message.sender === currentUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {format(parseISO(message.timestamp), 'MM/dd/yyyy h:mm a')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageView;