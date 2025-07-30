import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableRow, Paper, IconButton, Divider, Tooltip
} from '@mui/material';
import { FileCopy, Download, ThumbUp, ThumbDown } from '@mui/icons-material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip
} from 'recharts';

const ChatResponseCard = React.memo(({ text, entities, chartData }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
    <Paper sx={{ p: 2, maxWidth: '80%' }}>
      <Typography variant="body1" sx={{ mb: 2 }}>{text}</Typography>

      <Typography variant="subtitle1">Entities</Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {entities.map((e, i) => (
              <TableRow key={i}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Chart</Typography>
      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Copy"><IconButton><FileCopy /></IconButton></Tooltip>
        <Tooltip title="Download"><IconButton><Download /></IconButton></Tooltip>
        <Tooltip title="Like"><IconButton><ThumbUp /></IconButton></Tooltip>
        <Tooltip title="Dislike"><IconButton><ThumbDown /></IconButton></Tooltip>
      </Box>
    </Paper>
  </Box>
));

export default ChatResponseCard;