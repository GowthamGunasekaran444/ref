import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatList from './components/ChatList';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    const botMsg = {
      sender: 'bot',
      text: `Here is some data related to "${input}"`,
      entities: [
        { name: 'Query', value: input },
        { name: 'Intent', value: 'ExampleIntent' },
      ],
      chartData: [
        { name: 'A', value: 100 },
        { name: 'B', value: 200 },
        { name: 'C', value: 150 },
      ],
    };

    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">ChatGPT Clone</Typography>
        </Toolbar>
      </AppBar>

      <ChatList messages={messages} />

      <Box sx={{ display: 'flex', p: 1, borderTop: '1px solid #ccc' }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <IconButton color="primary" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}