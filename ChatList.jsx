import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import ChatMessage from './ChatMessage';
import ChatResponseCard from './ChatResponseCard';

export default function ChatList({ messages }) {
  return (
    <Virtuoso
      style={{ height: 'calc(100vh - 140px)' }}
      data={messages}
      followOutput
      itemContent={(index, message) =>
        message.sender === 'user'
          ? <ChatMessage text={message.text} />
          : <ChatResponseCard {...message} />
      }
    />
  );
}