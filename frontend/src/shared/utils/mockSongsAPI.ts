import { Song, SongsResponse, SongFilters, CreateSongRequest, UpdateSongRequest, ReservationInfo, AcceptSaleRequest, RejectSaleRequest } from '@/features/songs/types';

// Datos simulados de canciones
let mockSongs: Song[] = [
  {
    id: '1',
    name: 'Echoes of Tomorrow',
    artist: 'Administrador',
    genre: 'electronic',
    duration: 245, // 4:05
    price: 2.99,
    status: 'for_sale',
    url: '/audio/echoes-tomorrow.mp3',
    coverImage: '/images/covers/echoes.jpg',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    artistId: '1'
  },
  {
    id: '2',
    name: 'Midnight Blues',
    artist: 'Administrador',
    genre: 'blues',
    duration: 198, // 3:18
    price: 1.99,
    status: 'reserved',
    url: '/audio/midnight-blues.mp3',
    coverImage: '/images/covers/midnight.jpg',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    artistId: '1'
  },
  {
    id: '3',
    name: 'Summer Vibes',
    artist: 'Administrador',
    genre: 'pop',
    duration: 210, // 3:30
    price: 2.49,
    status: 'draft',
    url: '/audio/summer-vibes.mp3',
    coverImage: '/images/covers/summer.jpg',
    createdAt: '2024-02-01T16:45:00Z',
    updatedAt: '2024-02-01T16:45:00Z',
    artistId: '1'
  },
  {
    id: '4',
    name: 'Rock Anthem',
    artist: 'Usuario Normal',
    genre: 'rock',
    duration: 180, // 3:00
    price: 3.99,
    status: 'for_sale',
    url: '/audio/rock-anthem.mp3',
    coverImage: '/images/covers/rock.jpg',
    createdAt: '2024-01-20T11:20:00Z',
    updatedAt: '2024-01-22T14:10:00Z',
    artistId: '2'
  },
  {
    id: '5',
    name: 'Ocean Dreams',
    artist: 'Usuario Normal',
    genre: 'classical',
    duration: 320, // 5:20
    price: 4.99,
    status: 'reserved',
    url: '/audio/ocean-dreams.mp3',
    coverImage: '/images/covers/ocean.jpg',
    createdAt: '2024-02-05T09:30:00Z',
    updatedAt: '2024-02-05T09:30:00Z',
    artistId: '2'
  },
  {
    id: '6',
    name: 'Jazz Nights',
    artist: 'Usuario Normal',
    genre: 'jazz',
    duration: 275, // 4:35
    price: 5.49,
    status: 'sold',
    url: '/audio/jazz-nights.mp3',
    coverImage: '/images/covers/jazz.jpg',
    createdAt: '2024-01-05T15:45:00Z',
    updatedAt: '2024-01-08T12:20:00Z',
    artistId: '2'
  }
];

// Datos simulados de reservas
let mockReservations: ReservationInfo[] = [
  {
    id: 'res-1',
    songId: '2',
    buyerId: 'buyer-1',
    buyerName: 'Carlos García',
    buyerEmail: 'carlos@example.com',
    reservedAt: '2024-02-10T10:00:00Z',
    expiresAt: '2024-02-17T10:00:00Z',
    offerPrice: 1.99,
    message: '¡Me encanta esta canción! Perfecta para mi playlist de blues.'
  },
  {
    id: 'res-2',
    songId: '5',
    buyerId: 'buyer-2',
    buyerName: 'María López',
    buyerEmail: 'maria@example.com',
    reservedAt: '2024-02-11T14:30:00Z',
    expiresAt: '2024-02-18T14:30:00Z',
    offerPrice: 4.50,
    message: 'Música relajante perfecta para mi estudio. ¿Aceptarías $4.50?'
  }
];

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSongsAPI = {
  // GET /songs/mine - Obtener canciones del usuario autenticado
  getMySongs: async (artistId: string = '1'): Promise<SongsResponse> => {
    await delay(500);
    
    const userSongs = mockSongs.filter(song => song.artistId === artistId);
    
    return {
      songs: userSongs,
      total: userSongs.length,
      page: 1,
      limit: 10
    };
  },

  // POST /songs - Crear nueva canción
  createSong: async (songData: CreateSongRequest, artistId: string = '1'): Promise<Song> => {
    await delay(800);
    
    const newSong: Song = {
      id: Date.now().toString(),
      ...songData,
      artist: 'Administrador', // En una app real vendría del usuario autenticado
      status: 'draft',
      artistId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockSongs.push(newSong);
    return newSong;
  },

  // PUT /songs/:id - Actualizar canción
  updateSong: async (id: string, songData: UpdateSongRequest, artistId: string = '1'): Promise<Song> => {
    await delay(600);
    
    const songIndex = mockSongs.findIndex(song => song.id === id && song.artistId === artistId);
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada o no tienes permisos para editarla');
    }
    
    const currentSong = mockSongs[songIndex];
    
    // Verificar si la canción puede ser editada
    if (currentSong.status === 'sold') {
      throw new Error('No puedes editar una canción que ya fue vendida');
    }
    
    const updatedSong: Song = {
      ...currentSong,
      ...songData,
      updatedAt: new Date().toISOString()
    };
    
    mockSongs[songIndex] = updatedSong;
    return updatedSong;
  },

  // DELETE /songs/:id - Eliminar canción
  deleteSong: async (id: string, artistId: string = '1'): Promise<void> => {
    await delay(400);
    
    const songIndex = mockSongs.findIndex(song => song.id === id && song.artistId === artistId);
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada o no tienes permisos para eliminarla');
    }
    
    const song = mockSongs[songIndex];
    
    // Verificar si la canción puede ser eliminada
    if (song.status === 'sold') {
      throw new Error('No puedes eliminar una canción que ya fue vendida');
    }
    
    mockSongs.splice(songIndex, 1);
  },

  // GET /songs/:id - Obtener canción por ID
  getSongById: async (id: string, artistId: string = '1'): Promise<Song | null> => {
    await delay(300);
    
    const song = mockSongs.find(song => song.id === id && song.artistId === artistId);
    return song || null;
  },

  // Filtrar canciones
  filterSongs: (songs: Song[], filters: SongFilters): Song[] => {
    return songs.filter(song => {
      const matchesGenre = !filters.genre || song.genre === filters.genre;
      const matchesStatus = !filters.status || song.status === filters.status;
      const matchesSearch = !filters.search || 
        song.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        song.artist.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesGenre && matchesStatus && matchesSearch;
    });
  },

  // Obtener reservas por artista
  getReservationsByArtist: async (artistId: string = '1'): Promise<ReservationInfo[]> => {
    await delay(300);
    
    const artistSongs = mockSongs.filter(song => song.artistId === artistId);
    const artistSongIds = artistSongs.map(song => song.id);
    
    return mockReservations.filter(reservation => 
      artistSongIds.includes(reservation.songId)
    );
  },

  // Aceptar venta
  acceptSale: async (request: AcceptSaleRequest, artistId: string = '1'): Promise<Song> => {
    await delay(600);
    
    const reservation = mockReservations.find(r => r.id === request.reservationId);
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    const songIndex = mockSongs.findIndex(song => 
      song.id === reservation.songId && song.artistId === artistId
    );
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada o no tienes permisos');
    }

    // Actualizar canción a vendida
    const updatedSong: Song = {
      ...mockSongs[songIndex],
      status: 'sold',
      updatedAt: new Date().toISOString()
    };
    
    mockSongs[songIndex] = updatedSong;
    
    // Remover la reserva
    const reservationIndex = mockReservations.findIndex(r => r.id === request.reservationId);
    if (reservationIndex !== -1) {
      mockReservations.splice(reservationIndex, 1);
    }
    
    return updatedSong;
  },

  // Rechazar venta
  rejectSale: async (request: RejectSaleRequest, artistId: string = '1'): Promise<Song> => {
    await delay(400);
    
    const reservation = mockReservations.find(r => r.id === request.reservationId);
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    const songIndex = mockSongs.findIndex(song => 
      song.id === reservation.songId && song.artistId === artistId
    );
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada o no tienes permisos');
    }

    // Regresar canción a en venta
    const updatedSong: Song = {
      ...mockSongs[songIndex],
      status: 'for_sale',
      updatedAt: new Date().toISOString()
    };
    
    mockSongs[songIndex] = updatedSong;
    
    // Remover la reserva
    const reservationIndex = mockReservations.findIndex(r => r.id === request.reservationId);
    if (reservationIndex !== -1) {
      mockReservations.splice(reservationIndex, 1);
    }
    
    return updatedSong;
  },

  // GET /songs/available - Obtener canciones disponibles para compra (modo comprador)
  getAvailableSongs: async (filters?: { genre?: string; maxPrice?: number; search?: string }): Promise<{
    songs: Song[];
    total: number;
  }> => {
    await delay(400);
    
    let availableSongs = mockSongs.filter(song => 
      song.status === 'published' || song.status === 'for_sale'
    );
    
    // Aplicar filtros
    if (filters?.genre) {
      availableSongs = availableSongs.filter(song => song.genre === filters.genre);
    }
    
    if (filters?.maxPrice && filters.maxPrice > 0) {
      availableSongs = availableSongs.filter(song => song.price <= filters.maxPrice!);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      availableSongs = availableSongs.filter(song => 
        song.name.toLowerCase().includes(searchLower) ||
        song.artist.toLowerCase().includes(searchLower) ||
        song.genre.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      songs: availableSongs,
      total: availableSongs.length
    };
  },

  // POST /licenses - Iniciar solicitud de compra (Task 9)
  purchaseSong: async (request: {
    songId: string;
    buyerMessage?: string;
    offerPrice?: number;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
  }): Promise<{
    licenseId: string;
    reservationId: string;
    expiresAt: string;
    message: string;
  }> => {
    await delay(800);
    
    const songIndex = mockSongs.findIndex(song => song.id === request.songId);
    
    if (songIndex === -1) {
      throw new Error('Canción no encontrada');
    }
    
    const song = mockSongs[songIndex];
    
    if (song.status !== 'published' && song.status !== 'for_sale') {
      throw new Error('Esta canción no está disponible para compra');
    }
    
    // Cambiar estado de la canción a reservada
    const updatedSong: Song = {
      ...song,
      status: 'reserved',
      updatedAt: new Date().toISOString()
    };
    
    mockSongs[songIndex] = updatedSong;
    
    // Crear reserva
    const reservationId = `res_${Date.now()}`;
    const licenseId = `lic_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 horas
    
    const newReservation: ReservationInfo = {
      id: reservationId,
      songId: request.songId,
      buyerId: request.buyerId,
      buyerName: request.buyerName,
      buyerEmail: request.buyerEmail,
      reservedAt: new Date().toISOString(),
      expiresAt,
      offerPrice: request.offerPrice || song.price,
      message: request.buyerMessage || ''
    };
    
    mockReservations.push(newReservation);
    
    return {
      licenseId,
      reservationId,
      expiresAt,
      message: 'Solicitud de compra enviada exitosamente. El artista tiene 48 horas para responder.'
    };
  }
};

// Utilidades para formatear datos
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getStatusLabel = (status: Song['status']): string => {
  const labels = {
    draft: 'Borrador',
    published: 'Publicada',
    under_review: 'En Revisión',
    rejected: 'Rechazada',
    sold: 'Vendida',
    reserved: 'Reservada',
    for_sale: 'En Venta'
  };
  return labels[status];
};

export const getStatusColor = (status: Song['status']): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    sold: 'bg-blue-100 text-blue-800',
    reserved: 'bg-orange-100 text-orange-800',
    for_sale: 'bg-purple-100 text-purple-800'
  };
  return colors[status];
};
