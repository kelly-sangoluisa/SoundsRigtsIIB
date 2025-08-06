const express = require('express');
const app = express();

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mock data
let mockSongs = [
  {
    id: 1,
    title: 'Echoes of Tomorrow',
    artist_id: 1,
    artist: { id: 1, username: 'admin' },
    genre: 'electronic',
    price: 2.99,
    status: 'for_sale',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Midnight Blues',
    artist_id: 1,
    artist: { id: 1, username: 'admin' },
    genre: 'blues',
    price: 1.99,
    status: 'for_sale',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 3,
    title: 'Summer Vibes',
    artist_id: 2,
    artist: { id: 2, username: 'artist1' },
    genre: 'pop',
    price: 2.49,
    status: 'for_sale',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z'
  }
];

let mockLicenses = [
  {
    id: 1,
    song_id: 1,
    buyer_id: 3,
    seller_id: 1,
    song: { id: 1, title: 'Echoes of Tomorrow', price: 2.99 },
    buyer: { id: 3, username: 'buyer1' },
    seller: { id: 1, username: 'admin' },
    created_at: '2024-01-20T15:30:00Z'
  }
];

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'songs-service', port: 3002 });
});

// SONGS ENDPOINTS

// Get user's songs
app.get('/songs/mine', (req, res) => {
  const userId = parseInt(req.query.userId);
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const userSongs = mockSongs.filter(song => song.artist_id === userId);
  
  res.json({
    songs: userSongs.map(song => ({
      id: song.id,
      name: song.title,
      artist: song.artist.username,
      genre: song.genre,
      price: song.price,
      status: song.status,
      createdAt: song.created_at,
      updatedAt: song.updated_at,
      artistId: song.artist_id
    })),
    total: userSongs.length
  });
});

// Get available songs
app.get('/songs/available', (req, res) => {
  const { genre, maxPrice, search } = req.query;
  
  let availableSongs = mockSongs.filter(song => song.status === 'for_sale');
  
  if (genre) {
    availableSongs = availableSongs.filter(song => song.genre === genre);
  }
  
  if (maxPrice) {
    availableSongs = availableSongs.filter(song => song.price <= parseFloat(maxPrice));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    availableSongs = availableSongs.filter(song => 
      song.title.toLowerCase().includes(searchLower) ||
      song.artist.username.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    songs: availableSongs.map(song => ({
      id: song.id,
      name: song.title,
      artist: song.artist.username,
      genre: song.genre,
      price: song.price,
      status: song.status,
      createdAt: song.created_at,
      updatedAt: song.updated_at,
      artistId: song.artist_id
    })),
    total: availableSongs.length
  });
});

// Create song
app.post('/songs', (req, res) => {
  const { title, genre, price, artistId } = req.body;
  
  if (!title || !genre || !price || !artistId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newSong = {
    id: mockSongs.length + 1,
    title,
    artist_id: artistId,
    artist: { id: artistId, username: 'user' }, // Mock artist
    genre,
    price: parseFloat(price),
    status: 'for_sale',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockSongs.push(newSong);
  
  res.status(201).json({
    id: newSong.id,
    name: newSong.title,
    genre: newSong.genre,
    price: newSong.price,
    status: newSong.status,
    createdAt: newSong.created_at,
    updatedAt: newSong.updated_at,
    artistId: newSong.artist_id
  });
});

// Update song
app.put('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const { title, genre, price, artistId } = req.body;
  
  const songIndex = mockSongs.findIndex(song => song.id === songId);
  
  if (songIndex === -1) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  const song = mockSongs[songIndex];
  
  if (song.artist_id !== artistId) {
    return res.status(403).json({ message: 'You can only edit your own songs' });
  }
  
  if (song.status === 'sold') {
    return res.status(403).json({ message: 'Cannot edit a sold song' });
  }
  
  // Update song
  if (title) song.title = title;
  if (genre) song.genre = genre;
  if (price) song.price = parseFloat(price);
  song.updated_at = new Date().toISOString();
  
  res.json({
    id: song.id,
    name: song.title,
    genre: song.genre,
    price: song.price,
    status: song.status,
    createdAt: song.created_at,
    updatedAt: song.updated_at,
    artistId: song.artist_id
  });
});

// Delete song
app.delete('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId);
  
  const songIndex = mockSongs.findIndex(song => song.id === songId);
  
  if (songIndex === -1) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  const song = mockSongs[songIndex];
  
  if (song.artist_id !== userId) {
    return res.status(403).json({ message: 'You can only delete your own songs' });
  }
  
  if (song.status === 'sold') {
    return res.status(403).json({ message: 'Cannot delete a sold song' });
  }
  
  mockSongs.splice(songIndex, 1);
  
  res.json({ message: 'Song deleted successfully' });
});

// Get song by ID
app.get('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const song = mockSongs.find(song => song.id === songId);
  
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  res.json({
    id: song.id,
    name: song.title,
    artist: song.artist.username,
    genre: song.genre,
    price: song.price,
    status: song.status,
    createdAt: song.created_at,
    updatedAt: song.updated_at,
    artistId: song.artist_id
  });
});

// Purchase song
app.post('/songs/:id/purchase', (req, res) => {
  const songId = parseInt(req.params.id);
  const { buyerId, buyerMessage, offerPrice } = req.body;
  
  const song = mockSongs.find(song => song.id === songId);
  
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  if (song.status !== 'for_sale') {
    return res.status(403).json({ message: 'Song is not available for purchase' });
  }
  
  // Update song status to pending
  song.status = 'pending';
  song.updated_at = new Date().toISOString();
  
  // Create license
  const newLicense = {
    id: mockLicenses.length + 1,
    song_id: songId,
    buyer_id: buyerId,
    seller_id: song.artist_id,
    song: { id: song.id, title: song.title, price: song.price },
    buyer: { id: buyerId, username: 'buyer' },
    seller: { id: song.artist_id, username: song.artist.username },
    created_at: new Date().toISOString()
  };
  
  mockLicenses.push(newLicense);
  
  res.json({
    licenseId: newLicense.id,
    message: 'Purchase request sent successfully',
    status: 'pending'
  });
});

// LICENSES ENDPOINTS

// Get purchased licenses
app.get('/licenses/purchased', (req, res) => {
  const userId = parseInt(req.query.userId);
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  const purchasedLicenses = mockLicenses.filter(license => license.buyer_id === userId);
  
  res.json({
    licenses: purchasedLicenses.map(license => ({
      id: license.id,
      songId: license.song_id,
      songTitle: license.song.title,
      artistName: license.seller.username,
      price: license.song.price,
      purchaseDate: license.created_at
    }))
  });
});

// Get sold licenses
app.get('/licenses/sold', (req, res) => {
  const userId = parseInt(req.query.userId);
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  const soldLicenses = mockLicenses.filter(license => license.seller_id === userId);
  
  res.json({
    licenses: soldLicenses.map(license => ({
      id: license.id,
      songId: license.song_id,
      songTitle: license.song.title,
      buyerName: license.buyer.username,
      price: license.song.price,
      saleDate: license.created_at
    }))
  });
});

// Accept/Reject song sale (for artist to manage purchase requests)
app.patch('/songs/:id/status', (req, res) => {
  const songId = parseInt(req.params.id);
  const { status, artistId } = req.body;
  
  const song = mockSongs.find(song => song.id === songId);
  
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  
  if (song.artist_id !== artistId) {
    return res.status(403).json({ message: 'You can only update your own songs' });
  }
  
  song.status = status;
  song.updated_at = new Date().toISOString();
  
  res.json({
    id: song.id,
    name: song.title,
    artist: song.artist.username,
    genre: song.genre,
    price: song.price,
    status: song.status,
    createdAt: song.created_at,
    updatedAt: song.updated_at,
    artistId: song.artist_id
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Songs Service running on port ${port}`);
});
