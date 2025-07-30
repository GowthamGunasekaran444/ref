import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export default function ChatMessage({ text }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
      <Paper sx={{ p: 1.5, maxWidth: '70%', backgroundColor: '#1976d2', color: 'white' }}>
        <Typography>{text}</Typography>
      </Paper>
    </Box>
  );
}