import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Conversation {
  _id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  avatar?: string;
  role: string;
}

interface MessageListProps {
  conversations: Conversation[] | undefined;
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ conversations, selectedConversation, onSelectConversation }) => {
  const getName = (conversation: Conversation) => {
    if (conversation.role === 'agency') {
      return conversation.companyName;
    }
    return `${conversation.firstName} ${conversation.lastName}`;
  };

  if (!conversations) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div className="h-full">
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className={`flex items-center p-4 cursor-pointer hover:bg-accent transition-colors duration-200 ${
            selectedConversation === conversation._id ? 'bg-accent' : ''
          }`}
          onClick={() => onSelectConversation(conversation._id)}
        >
          <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback>{getName(conversation).charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold truncate">{getName(conversation)}</h3>
            <p className="text-sm text-muted-foreground">{conversation.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;