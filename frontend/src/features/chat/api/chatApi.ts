import { 
  Chat, 
  ChatMessage, 
  CreateMessageRequest, 
  CreateMessageResponse,
  ChatListResponse,
  ChatMessagesResponse,
  ChatFilters 
} from '../types';

// Mock data para chats
const mockChats: Chat[] = [
  {
    id: 'chat_1',
    songId: 'song_1',
    songTitle: 'Midnight Dreams',
    songArtist: 'Elena Rodriguez',
    participants: [
      {
        id: 'user_artist_1',
        name: 'Elena Rodriguez',
        email: 'elena@music.com',
        role: 'artist',
        avatar: '🎤'
      },
      {
        id: 'user_buyer_1',
        name: 'Carlos Martinez',
        email: 'carlos@company.com',
        role: 'buyer',
        avatar: '👨‍💼'
      }
    ],
    lastMessage: {
      id: 'msg_3',
      chatId: 'chat_1',
      senderId: 'user_buyer_1',
      senderName: 'Carlos Martinez',
      senderRole: 'buyer',
      content: '¿Podrías enviarme los stems individuales?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      type: 'text'
    },
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    unreadCount: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chat_2',
    songId: 'song_2',
    songTitle: 'Urban Vibes',
    songArtist: 'DJ Mike Flow',
    participants: [
      {
        id: 'user_artist_2',
        name: 'DJ Mike Flow',
        email: 'mike@beats.com',
        role: 'artist',
        avatar: '🎧'
      },
      {
        id: 'user_buyer_2',
        name: 'Sofia Chen',
        email: 'sofia@media.com',
        role: 'buyer',
        avatar: '👩‍💻'
      }
    ],
    lastMessage: {
      id: 'msg_8',
      chatId: 'chat_2',
      senderId: 'user_artist_2',
      senderName: 'DJ Mike Flow',
      senderRole: 'artist',
      content: '¡Perfecto! Te envío todo por email. Gracias por comprar mi música.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'chat_3',
    songId: 'song_3',
    songTitle: 'Acoustic Soul',
    songArtist: 'Luna Santos',
    participants: [
      {
        id: 'user_artist_3',
        name: 'Luna Santos',
        email: 'luna@folk.com',
        role: 'artist',
        avatar: '🎸'
      },
      {
        id: 'user_buyer_3',
        name: 'Alex Thompson',
        email: 'alex@creative.com',
        role: 'buyer',
        avatar: '🎬'
      }
    ],
    lastMessage: {
      id: 'msg_12',
      chatId: 'chat_3',
      senderId: 'user_buyer_3',
      senderName: 'Alex Thompson',
      senderRole: 'buyer',
      content: 'Gracias por la licencia comercial. ¿Hay alguna restricción para uso en redes sociales?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      type: 'text'
    },
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    unreadCount: 2,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock data para mensajes
const mockMessages: { [chatId: string]: ChatMessage[] } = {
  chat_1: [
    {
      id: 'msg_1',
      chatId: 'chat_1',
      senderId: 'user_buyer_1',
      senderName: 'Carlos Martinez',
      senderRole: 'buyer',
      content: 'Hola Elena, acabo de comprar la licencia de "Midnight Dreams". ¡Me encanta la canción!',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_2',
      chatId: 'chat_1',
      senderId: 'user_artist_1',
      senderName: 'Elena Rodriguez',
      senderRole: 'artist',
      content: '¡Hola Carlos! Muchas gracias por tu compra. Me alegra que te guste la canción. ¿En qué proyecto la vas a usar?',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_3',
      chatId: 'chat_1',
      senderId: 'user_buyer_1',
      senderName: 'Carlos Martinez',
      senderRole: 'buyer',
      content: '¿Podrías enviarme los stems individuales?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      type: 'text'
    }
  ],
  chat_2: [
    {
      id: 'msg_4',
      chatId: 'chat_2',
      senderId: 'user_buyer_2',
      senderName: 'Sofia Chen',
      senderRole: 'buyer',
      content: 'Hola Mike! Compré la licencia comercial de "Urban Vibes" para un proyecto de marketing.',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_5',
      chatId: 'chat_2',
      senderId: 'user_artist_2',
      senderName: 'DJ Mike Flow',
      senderRole: 'artist',
      content: '¡Genial Sofia! ¿Necesitas algún formato específico o archivos adicionales?',
      timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_6',
      chatId: 'chat_2',
      senderId: 'user_buyer_2',
      senderName: 'Sofia Chen',
      senderRole: 'buyer',
      content: 'Sí, si pudieras enviarme la versión en WAV de alta calidad sería perfecto.',
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_7',
      chatId: 'chat_2',
      senderId: 'user_artist_2',
      senderName: 'DJ Mike Flow',
      senderRole: 'artist',
      content: 'Por supuesto, te envío el WAV 24-bit/96kHz.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_8',
      chatId: 'chat_2',
      senderId: 'user_artist_2',
      senderName: 'DJ Mike Flow',
      senderRole: 'artist',
      content: '¡Perfecto! Te envío todo por email. Gracias por comprar mi música.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    }
  ],
  chat_3: [
    {
      id: 'msg_9',
      chatId: 'chat_3',
      senderId: 'user_buyer_3',
      senderName: 'Alex Thompson',
      senderRole: 'buyer',
      content: 'Hola Luna, me encanta "Acoustic Soul". Quiero usarla en un documental.',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_10',
      chatId: 'chat_3',
      senderId: 'user_artist_3',
      senderName: 'Luna Santos',
      senderRole: 'artist',
      content: '¡Qué emocionante! Me encantaría que uses mi música en tu documental. ¿De qué trata?',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_11',
      chatId: 'chat_3',
      senderId: 'user_buyer_3',
      senderName: 'Alex Thompson',
      senderRole: 'buyer',
      content: 'Es sobre artistas independientes. Tu música encaja perfectamente con el mensaje.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      type: 'text'
    },
    {
      id: 'msg_12',
      chatId: 'chat_3',
      senderId: 'user_buyer_3',
      senderName: 'Alex Thompson',
      senderRole: 'buyer',
      content: 'Gracias por la licencia comercial. ¿Hay alguna restricción para uso en redes sociales?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      type: 'text'
    }
  ]
};

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API mock para chats
export const chatApi = {
  // GET /chats - Obtener lista de chats
  getChats: async (userId: string, filters?: ChatFilters): Promise<ChatListResponse> => {
    await delay(800);
    
    let filteredChats = mockChats.filter(chat => 
      chat.participants.some(p => p.id === userId)
    );

    // Aplicar filtros
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredChats = filteredChats.filter(chat =>
        chat.songTitle.toLowerCase().includes(searchLower) ||
        chat.songArtist.toLowerCase().includes(searchLower) ||
        chat.participants.some(p => p.name.toLowerCase().includes(searchLower))
      );
    }

    if (filters?.songId) {
      filteredChats = filteredChats.filter(chat => chat.songId === filters.songId);
    }

    if (filters?.status && filters.status !== 'all') {
      filteredChats = filteredChats.filter(chat => 
        filters.status === 'active' ? chat.isActive : !chat.isActive
      );
    }

    // Ordenar
    switch (filters?.sortBy) {
      case 'recent':
        filteredChats.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        break;
      case 'oldest':
        filteredChats.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'activity':
      default:
        filteredChats.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        break;
    }

    return {
      chats: filteredChats,
      total: filteredChats.length,
      success: true
    };
  },

  // POST /chats - Crear nuevo chat (Task 14)
  createChat: async (songId: string, buyerId: string, artistId: string): Promise<{ chat: Chat; success: boolean }> => {
    await delay(600);
    
    // Verificar si ya existe un chat para esta canción entre estos usuarios
    const existingChat = mockChats.find(chat => 
      chat.songId === songId && 
      chat.participants.some(p => p.id === buyerId) &&
      chat.participants.some(p => p.id === artistId)
    );

    if (existingChat) {
      return {
        chat: existingChat,
        success: true
      };
    }

    // Obtener información de la canción (esto vendría de la API de canciones)
    const songInfo = getSongInfo(songId);
    const buyerInfo = getUserInfo(buyerId);
    const artistInfo = getUserInfo(artistId);

    if (!songInfo || !buyerInfo || !artistInfo) {
      throw new Error('Información de canción o usuarios no encontrada');
    }

    // Crear nuevo chat
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      songId,
      songTitle: songInfo.title,
      songArtist: songInfo.artist,
      participants: [artistInfo, buyerInfo],
      lastMessage: {
        id: `msg_${Date.now()}`,
        chatId: `chat_${Date.now()}`,
        senderId: 'system',
        senderName: 'Sistema',
        senderRole: 'artist', // Required by type but not used for system messages
        content: `¡Chat creado! ${buyerInfo.name} ha adquirido una licencia de "${songInfo.title}". ¡Pueden comunicarse aquí para cualquier consulta sobre la licencia!`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'system'
      },
      lastActivity: new Date().toISOString(),
      isActive: true,
      unreadCount: 1,
      createdAt: new Date().toISOString()
    };

    // Añadir al mock
    mockChats.push(newChat);

    // Crear mensaje inicial del sistema
    if (!mockMessages[newChat.id]) {
      mockMessages[newChat.id] = [];
    }
    mockMessages[newChat.id].push(newChat.lastMessage!);

    return {
      chat: newChat,
      success: true
    };
  },

  // GET /chats/:id/messages - Obtener mensajes de un chat
  getChatMessages: async (chatId: string): Promise<ChatMessagesResponse> => {
    await delay(600);
    
    const messages = mockMessages[chatId] || [];
    
    return {
      messages: messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      total: messages.length,
      success: true
    };
  },

  // POST /chats/:id/messages - Enviar nuevo mensaje
  sendMessage: async (chatId: string, userId: string, request: CreateMessageRequest): Promise<CreateMessageResponse> => {
    await delay(500);
    
    // Encontrar el chat y el usuario
    const chat = mockChats.find(c => c.id === chatId);
    const user = chat?.participants.find(p => p.id === userId);
    
    if (!chat || !user) {
      throw new Error('Chat o usuario no encontrado');
    }

    // Crear nuevo mensaje
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: userId,
      senderName: user.name,
      senderRole: user.role,
      content: request.content,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    };

    // Añadir mensaje al mock
    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }
    mockMessages[chatId].push(newMessage);

    // Actualizar último mensaje del chat
    chat.lastMessage = newMessage;
    chat.lastActivity = newMessage.timestamp;

    return {
      message: newMessage,
      success: true
    };
  },

  // Marcar mensajes como leídos
  markAsRead: async (chatId: string, userId: string): Promise<void> => {
    await delay(200);
    
    const messages = mockMessages[chatId] || [];
    messages.forEach(msg => {
      if (msg.senderId !== userId) {
        msg.isRead = true;
      }
    });

    // Actualizar contador de no leídos
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
    }
  }
};

// Funciones auxiliares para obtener información (en una app real vendrían de otras APIs)
function getSongInfo(songId: string): { title: string; artist: string } | null {
  const songs: { [key: string]: { title: string; artist: string } } = {
    'song_1': { title: 'Midnight Dreams', artist: 'Elena Rodriguez' },
    'song_2': { title: 'Urban Vibes', artist: 'DJ Mike Flow' },
    'song_3': { title: 'Acoustic Soul', artist: 'Luna Santos' },
    'song_4': { title: 'Electric Nights', artist: 'Neon Beats' },
    'song_5': { title: 'Folk Journey', artist: 'Mountain Echo' },
  };
  
  return songs[songId] || null;
}

function getUserInfo(userId: string): { id: string; name: string; email: string; role: 'artist' | 'buyer'; avatar?: string } | null {
  const users: { [key: string]: { id: string; name: string; email: string; role: 'artist' | 'buyer'; avatar?: string } } = {
    'user_artist_1': { id: 'user_artist_1', name: 'Elena Rodriguez', email: 'elena@music.com', role: 'artist', avatar: '🎤' },
    'user_artist_2': { id: 'user_artist_2', name: 'DJ Mike Flow', email: 'mike@beats.com', role: 'artist', avatar: '🎧' },
    'user_artist_3': { id: 'user_artist_3', name: 'Luna Santos', email: 'luna@folk.com', role: 'artist', avatar: '🎸' },
    'user_buyer_1': { id: 'user_buyer_1', name: 'Carlos Martinez', email: 'carlos@company.com', role: 'buyer', avatar: '👨‍💼' },
    'user_buyer_2': { id: 'user_buyer_2', name: 'Sofia Chen', email: 'sofia@media.com', role: 'buyer', avatar: '👩‍💻' },
    'user_buyer_3': { id: 'user_buyer_3', name: 'Alex Thompson', email: 'alex@creative.com', role: 'buyer', avatar: '🎬' },
  };
  
  return users[userId] || null;
}
