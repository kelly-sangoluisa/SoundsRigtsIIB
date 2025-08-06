const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'chat-service', port: 3003 });
});

app.get('/api/chat/status', (req, res) => {
  res.json({ message: 'Chat service is running', timestamp: new Date().toISOString() });
});

// CHAT ENDPOINTS
app.get('/api/chats', (req, res) => {
  res.json({
    chats: [
      {
        id: 1,
        participants: ['user1', 'user2'],
        lastMessage: 'Hola, me interesa tu beat',
        timestamp: new Date().toISOString(),
        unread: 2
      },
      {
        id: 2,
        participants: ['user1', 'user3'],
        lastMessage: '¿Cuál es el precio de la licencia?',
        timestamp: new Date().toISOString(),
        unread: 0
      }
    ]
  });
});

app.get('/api/chats/:id/messages', (req, res) => {
  const { id } = req.params;
  res.json({
    chatId: parseInt(id),
    messages: [
      {
        id: 1,
        sender: 'user1',
        message: 'Hola, me interesa tu beat',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        sender: 'user2',
        message: '¡Perfecto! Te puedo ofrecer diferentes tipos de licencia',
        timestamp: new Date().toISOString()
      }
    ]
  });
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Chat Service running on port ${port}`);
});
